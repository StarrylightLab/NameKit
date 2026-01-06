/**
 * NameKit - Figma Plugin Logic
 */

// UI is handled by Vite/index.html
figma.showUI(__html__, { width: 720, height: 600, themeColors: true });

// --- Helper Functions ---

const getPageName = (node: BaseNode): string => {
  let parent = node.parent;
  while (parent && parent.type !== 'PAGE') {
    parent = parent.parent;
  }
  return parent ? parent.name : 'Unknown Page';
};

const getPageOfNode = (node: BaseNode): PageNode | null => {
  let p: BaseNode | null = node;
  while (p && p.type !== 'PAGE') {
    p = p.parent;
    if (!p) return null;
  }
  return p as PageNode;
};

const getNodes = async (type: string, scope: string) => {
  let nodes: Array<{ id: string; name: string; type: string; subType?: string; page: string }> = [];

  try {
    if (type === 'COMPONENT') {
      let searchScope: any = figma.currentPage;
      
      if (scope === 'ALL_PAGES') {
        // Warning: This can be slow on large files
        await figma.loadAllPagesAsync();
        searchScope = figma.root;
      }
      
      // Find Components and Component Sets
      // Using findAll allows us to find nested components
      const found = searchScope.findAll((n: BaseNode) => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET');
      
      nodes = found.map((n: SceneNode) => ({
        id: n.id,
        name: n.name,
        type: 'COMP',
        subType: n.type,
        page: getPageName(n)
      }));
    } 
    else if (type === 'STYLE') {
      // Styles are document-wide, scope doesn't strictly apply but we list all
      const paints = figma.getLocalPaintStyles().map((s: any) => ({ id: s.id, name: s.name, type: 'STYLE', subType: 'COLOR', page: 'Styles' }));
      const texts = figma.getLocalTextStyles().map((s: any) => ({ id: s.id, name: s.name, type: 'STYLE', subType: 'TEXT', page: 'Typography' }));
      const effects = figma.getLocalEffectStyles().map((s: any) => ({ id: s.id, name: s.name, type: 'STYLE', subType: 'EFFECT', page: 'Effects' }));
      const grids = figma.getLocalGridStyles().map((s: any) => ({ id: s.id, name: s.name, type: 'STYLE', subType: 'GRID', page: 'Grids' }));
      
      nodes = [...paints, ...texts, ...effects, ...grids];
    } 
    else if (type === 'VARIABLE') {
      // Variables are collection-based
      const vars = figma.variables.getLocalVariables().map((v: any) => {
        let subType = 'STRING';
        if (v.resolvedType === 'COLOR') subType = 'COLOR';
        else if (v.resolvedType === 'FLOAT') subType = 'NUMBER';
        else if (v.resolvedType === 'BOOLEAN') subType = 'BOOL';
        
        return {
          id: v.id,
          name: v.name,
          type: 'VAR',
          subType: subType,
          page: 'Variables' // Could fetch collection name if needed
        };
      });
      nodes = vars;
    }
  } catch (err) {
    console.error('Error fetching nodes:', err);
  }

  return nodes;
};

// --- Message Handling ---

figma.ui.onmessage = async (msg: any) => {
  // 1. Fetch Nodes
  if (msg.type === 'GET_NODES') {
    const nodes = await getNodes(msg.payload.type, msg.payload.scope);
    figma.ui.postMessage({ type: 'SET_NODES', payload: nodes });
  }

  // 2. Focus/Select Node
  if (msg.type === 'FOCUS_NODE') {
    const id = msg.payload.id;
    try {
      const node = await figma.getNodeByIdAsync(id);
      if (node && 'type' in node) { // Check if it's a SceneNode (styles/vars are not SceneNodes)
         const page = getPageOfNode(node);
         if (page && page !== figma.currentPage) {
            figma.currentPage = page;
         }
         // @ts-ignore
         figma.viewport.scrollAndZoomIntoView([node]);
         figma.currentPage.selection = [node as SceneNode];
      } else {
        figma.notify("Cannot select Styles or Variables on canvas");
      }
    } catch (e) {
      // Node might not exist or be a Style/Var
    }
  }

  // 3. Apply Rename
  if (msg.type === 'APPLY_CHANGES') {
    const { changes, elementType, scope } = msg.payload; 
    let count = 0;
    
    // For batch operations on nodes, we might need to load pages if scope is ALL
    if (elementType === 'COMPONENT' && scope === 'ALL_PAGES') {
        await figma.loadAllPagesAsync();
    }

    for (const change of changes) {
      try {
        if (elementType === 'COMPONENT') {
          const node = await figma.getNodeByIdAsync(change.id);
          if (node) {
            node.name = change.name;
            count++;
          }
        } else if (elementType === 'STYLE') {
           const style = figma.getStyleById(change.id);
           if (style) {
             style.name = change.name;
             count++;
           }
        } else if (elementType === 'VARIABLE') {
           const variable = await figma.variables.getVariableByIdAsync(change.id);
           if (variable) {
             variable.name = change.name;
             count++;
           }
        }
      } catch (e) {
        console.error(`Failed to update ${change.id}`, e);
      }
    }
    
    if (count > 0) {
        figma.notify(`Updated ${count} items`);
    }

    // Refresh list to show updated names
    const nodes = await getNodes(elementType, scope || 'CURRENT_PAGE');
    figma.ui.postMessage({ type: 'SET_NODES', payload: nodes });
  }
};