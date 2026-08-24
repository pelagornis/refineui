import { definePlugin } from '@astrojs/starlight/expressive-code';

/**
 * Frames plugin always emits an empty `<figcaption class="header">` even when
 * `frame: "none"`. Strip those so the markup stays a plain code surface + copy.
 */
export function removeEmptyFrameHeaders() {
  return definePlugin({
    name: 'Remove empty frame headers',
    hooks: {
      postprocessRenderedBlock: ({ renderData }) => {
        const root = renderData.blockAst;
        if (root?.type !== 'element' || root.tagName !== 'figure' || !Array.isArray(root.children)) {
          return;
        }

        root.children = root.children.filter((child) => {
          if (child?.type !== 'element' || child.tagName !== 'figcaption') {
            return true;
          }

          const className = child.properties?.className;
          const isHeader =
            className === 'header' ||
            (Array.isArray(className) && className.includes('header'));
          if (!isHeader) {
            return true;
          }

          return (child.children ?? []).some((node) => {
            if (node.type === 'text') {
              return node.value.trim().length > 0;
            }
            return node.type === 'element';
          });
        });
      },
    },
  });
}
