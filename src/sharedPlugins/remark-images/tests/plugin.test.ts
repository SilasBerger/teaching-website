import { visit } from 'unist-util-visit';
import type { MdxJsxAttribute, MdxJsxTextElement } from 'mdast-util-mdx';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkDirective from 'remark-directive';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'url';
import { CaptionVisitor } from '../plugin';
import { VFile } from 'vfile';
import { Parent } from 'mdast';

const __filename = fileURLToPath(import.meta.url);

const alignLeft = (content: string) => {
    return content
        .split('\n')
        .map((line) => line.trimStart())
        .join('\n');
};

const process = async (content: string, captionVisitors: CaptionVisitor[] = []) => {
    const { default: plugin } = await import('../plugin');
    const file = new VFile({ value: alignLeft(content), history: [__filename] });

    const result = await remark()
        .use(remarkMdx)
        .use(remarkDirective)
        .use(plugin, { captionVisitors: captionVisitors })
        .process(file);

    return result.value;
};

describe('#image', () => {
    it("does nothing if there's no image", async () => {
        const input = `# Heading

            Some content
        `;
        const result = await process(input);
        expect(result).toBe(alignLeft(input));
    });
    it('wraps image in figure', async () => {
        const input = `# Heading

            ![](https://example.com/image.png)
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          <figure>
            ![](https://example.com/image.png)
          </figure>
          "
        `);
    });

    it('wraps consecutive images in separate figure', async () => {
        const input = `# Heading

          ![](https://example.com/image.png)
          ![](https://example.com/image.png)
      `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          <figure>
            ![](https://example.com/image.png)
          </figure>

          <figure>
            ![](https://example.com/image.png)
          </figure>
          "
        `);
    });

    it('sets width with --width=', async () => {
        const input = `# Heading

          ![Caption --width=200px](https://example.com/image.png)
      `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
        "# Heading

        <figure options={{"width":"200px"}}>
          ![Caption](https://example.com/image.png)

          <figcaption><span style={{"flexGrow":1}} />Caption<span style={{"flexGrow":1}} /></figcaption>
        </figure>
        "
      `);
    });
    it('sets width with --max-width=', async () => {
        const input = `# Heading

        ![Caption --max-width=200px](https://example.com/image.png)
    `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
      "# Heading

      <figure options={{"maxWidth":"200px"}}>
        ![Caption](https://example.com/image.png)

        <figcaption><span style={{"flexGrow":1}} />Caption<span style={{"flexGrow":1}} /></figcaption>
      </figure>
      "
    `);
    });

    it('extracts caption', async () => {
        const input = `# Heading
            ![image](https://example.com/image.png)
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          <figure>
            ![image](https://example.com/image.png)

            <figcaption><span style={{"flexGrow":1}} />image<span style={{"flexGrow":1}} /></figcaption>
          </figure>
          "
        `);
    });

    it('extracts links in caption', async () => {
        const input = `# Heading
            ![image [foo.bar](https://foo.bar)](https://example.com/image.png)
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          <figure>
            ![image foo.bar](https://example.com/image.png)

            <figcaption><span style={{"flexGrow":1}} />image [foo.bar](https://foo.bar)<span style={{"flexGrow":1}} /></figcaption>
          </figure>
          "
        `);
    });

    it('wraps local image with bib file to figure with sourceref', async () => {
        const input = `# Heading
            ![](assets/placeholder.svg)
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          <figure>
            ![](assets/placeholder.svg)

            <figcaption className="inline"><span style={{"flexGrow":1}} /><SourceRef bib={{"author":"Flanoz","source":"https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg","licence":"CC 0","licence_url":"https://creativecommons.org/publicdomain/zero/1.0/deed.en","edited":false}} /></figcaption>
          </figure>
          "
        `);
    });

    it('unwraps inline image to figures', async () => {
        const input = `# Heading
              Hello ![](assets/placeholder.svg) my friend.
          `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
            "# Heading

            Hello

            <figure>
              ![](assets/placeholder.svg)

              <figcaption className="inline"><span style={{"flexGrow":1}} /><SourceRef bib={{"author":"Flanoz","source":"https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg","licence":"CC 0","licence_url":"https://creativecommons.org/publicdomain/zero/1.0/deed.en","edited":false}} /></figcaption>
            </figure>

            my friend.
            "
          `);
    });
    it('prevents unwrapping inline image when @inline is present', async () => {
        const input = `# Heading
            Hello ![@inline --width=50px](assets/placeholder.svg) my friend.
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          Hello ![](assets/placeholder.svg) my friend.
          "
        `);
    });
    it('wraps inlined with post content', async () => {
        const input = `# Heading

            ![](https://example.com/image.png) hello 
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          <figure>
            ![](https://example.com/image.png)
          </figure>

          hello
          "
        `);
    });
    it('wraps inlined with pre and post content', async () => {
        const input = `# Heading

            hello ![](https://example.com/image.png) bello 
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          hello

          <figure>
            ![](https://example.com/image.png)
          </figure>

          bello
          "
        `);
    });
    it('wraps multiple inlined with post content', async () => {
        const input = `# Heading

            cello ![](https://example.com/image.png) hello ![](https://example.com/image.png) bello
        `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
          "# Heading

          cello

          <figure>
            ![](https://example.com/image.png)
          </figure>

          hello

          <figure>
            ![](https://example.com/image.png)
          </figure>

          bello
          "
        `);
    });

    it('processes caption as markdown', async () => {
        const input = `
      ![a **bold** caption](assets/placeholder.svg)
      `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
        "<figure>
          ![a bold caption](assets/placeholder.svg)

          <figcaption><span style={{"flexGrow":1}} />a **bold** caption<span style={{"flexGrow":1}} /><SourceRef bib={{"author":"Flanoz","source":"https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg","licence":"CC 0","licence_url":"https://creativecommons.org/publicdomain/zero/1.0/deed.en","edited":false}} /></figcaption>
        </figure>
        "
      `);
    });
    it('processes caption as markdown and supports links', async () => {
        const input = `
      ![a [link](https://link.com) caption](assets/placeholder.svg)
      `;
        const result = await process(input);
        expect(result).toMatchInlineSnapshot(`
        "<figure>
          ![a link caption](assets/placeholder.svg)

          <figcaption><span style={{"flexGrow":1}} />a [link](https://link.com) caption<span style={{"flexGrow":1}} /><SourceRef bib={{"author":"Flanoz","source":"https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg","licence":"CC 0","licence_url":"https://creativecommons.org/publicdomain/zero/1.0/deed.en","edited":false}} /></figcaption>
        </figure>
        "
      `);
    });
    it('processes caption and applies additional visitors', async () => {
        const visitor = (ast: Parent, source: string, config: { tagName?: string; className?: string }) => {
            visit(ast, 'strong', (node, idx, parent) => {
                if (!parent || node.position === undefined || idx === undefined) {
                    return;
                }
                const startOg = node.position.start.offset || 0;
                const endOg = node.position.end.offset;

                const strToOperateOn = source.substring(startOg, endOg);
                const wasUnderscored = strToOperateOn.startsWith('__') && strToOperateOn.endsWith('__');
                if (wasUnderscored) {
                    parent.children.splice(idx, 1, {
                        type: 'mdxJsxTextElement',
                        name: config.tagName || 'strong',
                        attributes: config.className
                            ? [{ type: 'mdxJsxAttribute', name: 'className', value: config.className }]
                            : [],
                        children: node.children
                    } as MdxJsxTextElement);
                }
            });
        };
        const captionVisitor: CaptionVisitor = (ast, source) => {
            visitor(ast, source, {
                className: 'boxed'
            });
        };
        const input = `
      ![a [__link__](https://link.com) caption](assets/placeholder.svg)
      `;
        const result = await process(input, [captionVisitor]);
        expect(result).toMatchInlineSnapshot(`
          "<figure>
            ![a link caption](assets/placeholder.svg)

            <figcaption><span style={{"flexGrow":1}} />a [<strong className="boxed">link</strong>](https://link.com) caption<span style={{"flexGrow":1}} /><SourceRef bib={{"author":"Flanoz","source":"https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg","licence":"CC 0","licence_url":"https://creativecommons.org/publicdomain/zero/1.0/deed.en","edited":false}} /></figcaption>
          </figure>
          "
        `);
    });
});
