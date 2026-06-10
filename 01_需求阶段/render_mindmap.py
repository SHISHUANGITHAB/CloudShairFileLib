import json, zipfile, textwrap
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch

# Read XMind
with zipfile.ZipFile("云端档案共享库.xmind", "r") as z:
    data = json.loads(z.read("content.json"))

# Chinese font setting
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'DengXian']
plt.rcParams['axes.unicode_minus'] = False

MAX_W = 30  # max chars per line

def wrap_text(text, width=MAX_W):
    if not text:
        return [""]
    # Replace newlines first
    text = text.replace("\\n", "\n")
    lines = []
    for para in text.split("\n"):
        para = para.strip()
        if not para:
            continue
        lines.extend(textwrap.wrap(para, width=width) if len(para) > width else [para])
    return lines if lines else [""]

def build_tree(topic, depth=0):
    """Build a list of (depth, title, wrapped_lines) in DFS order"""
    nodes = []
    title = topic.get("title", "")
    wrapped = wrap_text(title)
    nodes.append((depth, title, wrapped))
    for child in topic.get("children", {}).get("attached", []):
        nodes.extend(build_tree(child, depth + 1))
    return nodes

root = data[0]["rootTopic"]
all_nodes = build_tree(root)

# Calculate layout
max_depth = max(d[0] for d in all_nodes)
# Layout parameters
x_spacing = 28  # horizontal spacing between levels (in chars)
y_spacing = 0.8  # vertical spacing between sibling nodes
line_h = 0.25   # height per wrapped line
node_pad = 0.15

# Position map: id -> (x, y)
pos = {}
# We'll traverse again, assigning positions properly
# First pass: count siblings at each depth for centering

def assign_positions(topic, depth=0, x=0, y_bias=0):
    """Assign (x, y) positions. Returns list of y positions for this subtree."""
    children = topic.get("children", {}).get("attached", [])
    title = topic.get("title", "")
    wrapped = wrap_text(title)
    node_h = len(wrapped) * line_h + node_pad * 2

    if not children:
        # Leaf node
        mid_y = y_bias
        pos[id(topic)] = (x, mid_y, wrapped)
        return [mid_y]

    # Children positions
    child_ys = []
    for child in children:
        child_ys.extend(assign_positions(child, depth + 1, x + x_spacing, y_bias))
        # estimate height
        c_title = child.get("title", "")
        c_wrapped = wrap_text(c_title)
        c_h = len(c_wrapped) * line_h + node_pad * 2
        y_bias += c_h + y_spacing

    # Remove last spacing
    # Center this node above its children
    if child_ys:
        min_y = min(child_ys)
        max_y = max(child_ys)
        mid_y = (min_y + max_y) / 2
    else:
        mid_y = y_bias

    pos[id(topic)] = (x, mid_y, wrapped)
    return child_ys

# Actually let me do a simpler approach: DFS counting for layout
def calc_width(topic):
    """Calculate max depth of subtree"""
    children = topic.get("children", {}).get("attached", [])
    if not children:
        return 1
    return 1 + max(calc_width(c) for c in children)

def calc_height(topic):
    """Calculate total height of subtree"""
    children = topic.get("children", {}).get("attached", [])
    title = topic.get("title", "")
    wrapped = wrap_text(title)
    h = len(wrapped) * line_h + node_pad * 2
    if not children:
        return h
    return h + sum(calc_height(c) for c in children) + y_spacing * (len(children) - 1)

# Second approach: simpler layout using tree levels
# Collect nodes by level
levels = {}  # depth -> [(id, title, wrapped, parent_id)]
node_id_map = {}  # id -> info

idx = 0
def collect_levels(topic, depth=0, parent_id=None):
    global idx
    tid = idx
    idx += 1
    title = topic.get("title", "")
    wrapped = wrap_text(title)
    levels.setdefault(depth, []).append((tid, title, wrapped, parent_id))
    node_id_map[tid] = (depth, title, wrapped, parent_id)
    for child in topic.get("children", {}).get("attached", []):
        collect_levels(child, depth + 1, tid)

collect_levels(root)

# Assign positions
max_depth = max(levels.keys())

# Calculate node heights
def get_node_height(tid):
    _, _, wrapped, _ = node_id_map[tid]
    return len(wrapped) * line_h + node_pad * 2

# Calculate subtree heights
subtree_heights = {}
def calc_subtree_height(tid):
    depth, _, _, _ = node_id_map[tid]
    children = [(c_id, c_data) for c_id, c_data in node_id_map.items()
                if c_data[3] == tid]
    if not children:
        h = get_node_height(tid)
        subtree_heights[tid] = h
        return h
    ch = sum(calc_subtree_height(c[0]) for c in children) + y_spacing * (len(children) - 1)
    my_h = max(get_node_height(tid), ch)
    subtree_heights[tid] = my_h
    return my_h

calc_subtree_height(0)

# Assign y positions recursively
positions = {}
def assign_y(tid, y_start):
    depth, _, _, parent = node_id_map[tid]
    children = [(c_id, c_data) for c_id, c_data in node_id_map.items()
                if c_data[3] == tid]

    node_h = get_node_height(tid)

    if not children:
        positions[tid] = (depth * x_spacing, y_start + node_h/2)
        return y_start + node_h

    # Position children
    cy = y_start
    total_ch = sum(subtree_heights.get(c[0], get_node_height(c[0])) for c in children) + y_spacing * (len(children) - 1)
    my_y = y_start + (total_ch - node_h) / 2 if total_ch > node_h else y_start
    positions[tid] = (depth * x_spacing, my_y + node_h/2)

    y_pos = y_start
    for c_id, _ in children:
        c_h = subtree_heights.get(c_id, get_node_height(c_id))
        assign_y(c_id, y_pos)
        y_pos += c_h + y_spacing

    return y_start + max(node_h, total_ch)

total_h = assign_y(0, 0)

# Calculate total width
total_w = max_depth * x_spacing + MAX_W

# Create figure
fig_w = total_w / 8  # inches
fig_h = max(total_h + 2, 6) / 1.8
fig, ax = plt.subplots(figsize=(fig_w, fig_h), facecolor='white')
ax.set_xlim(-2, total_w + 2)
ax.set_ylim(-1, max(total_h + 2, 6))
ax.axis('off')

# Color scheme
depth_colors = {
    0: '#1a237e',  # root - dark blue
    1: '#d32f2f',  # level 1 - red
    2: '#1976d2',  # level 2 - blue
    3: '#388e3c',  # level 3 - green
    4: '#f57c00',  # level 4 - orange
    5: '#7b1fa2',  # level 5 - purple
}
border_colors = {
    0: '#1a237e',
    1: '#b71c1c',
    2: '#1565c0',
    3: '#2e7d32',
    4: '#e65100',
    5: '#6a1b9a',
}

def get_color(depth, theme='bg'):
    colors_bg = ['#e8eaf6', '#ffebee', '#e3f2fd', '#e8f5e9', '#fff3e0', '#f3e5f5']
    colors_border = ['#1a237e', '#c62828', '#1565c0', '#2e7d32', '#e65100', '#6a1b9a']
    if theme == 'bg':
        return colors_bg[min(depth, len(colors_bg)-1)]
    return colors_border[min(depth, len(colors_border)-1)]

# Draw connections first
for tid, (depth, title, wrapped, parent_id) in node_id_map.items():
    if tid == 0 or parent_id is None:
        continue
    if tid in positions and parent_id in positions:
        x1, y1 = positions[parent_id]
        x2, y2 = positions[tid]
        # Draw rounded elbow connector
        mid_x = (x1 + x2) / 2
        ax.plot([x1, mid_x, mid_x, x2], [y1, y1, y2, y2],
                color=get_color(depth, 'border'), linewidth=1.5, alpha=0.6, zorder=1)

# Draw nodes
for tid, (depth, title, wrapped, parent_id) in node_id_map.items():
    if tid not in positions:
        continue
    x, y = positions[tid]
    text_h = len(wrapped) * line_h
    box_w = MAX_W * 0.45  # approximate width in data coords
    box_h = text_h + node_pad * 2

    # Draw rounded rectangle
    bc = get_color(depth, 'border')
    bg = get_color(depth, 'bg')
    box = FancyBboxPatch((x - box_w/2, y - box_h/2), box_w, box_h,
                          boxstyle="round,pad=0.05", facecolor=bg,
                          edgecolor=bc, linewidth=1.5 if depth <= 2 else 1, zorder=2)
    ax.add_patch(box)

    # Draw text
    for i, line in enumerate(wrapped):
        text_y = y + text_h/2 - i * line_h - node_pad - line_h/4
        ax.text(x, text_y, line, fontsize=7 if depth > 0 else 10,
                ha='center', va='center', fontweight='bold' if depth <= 1 else 'normal',
                color='#1a1a1a', zorder=3)

plt.tight_layout()
plt.savefig("云端档案共享库-思维导图.png", dpi=200, bbox_inches='tight', facecolor='white')
print(f"Saved! Figure size: {fig_w:.1f}x{fig_h:.1f} inches")
print(f"Total nodes: {len(node_id_map)}")
