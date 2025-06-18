import { memo, useMemo, useState, createContext, useContext } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { marked } from 'marked';
import ShikiHighlighter from 'react-shiki';
import type { ComponentProps } from 'react';
import type { ExtraProps } from 'react-markdown';
import { Check, Copy, Terminal } from 'lucide-react';

type CodeComponentProps = ComponentProps<'code'> & ExtraProps;
type MarkdownSize = 'default' | 'small';

// Context to pass size down to components
const MarkdownSizeContext = createContext<MarkdownSize>('default');

const components: Components = {
   code: CodeBlock as Components['code'],
   pre: ({ children }) => <>{children}</>,
   blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-4 bg-muted/30 rounded-r-lg italic text-muted-foreground">
         {children}
      </blockquote>
   ),
   h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4 text-foreground border-b border-border pb-2">
         {children}
      </h1>
   ),
   h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mb-3 text-foreground border-b border-border/50 pb-1">
         {children}
      </h2>
   ),
   h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-2 text-foreground">
         {children}
      </h3>
   ),
   a: ({ href, children }) => (
      <a
         href={href}
         className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/50 hover:decoration-primary transition-colors"
         target="_blank"
         rel="noopener noreferrer"
      >
         {children}
      </a>
   ),
   table: ({ children }) => (
      <div className="overflow-x-auto my-4 rounded-lg border border-border">
         <table className="w-full border-collapse">
            {children}
         </table>
      </div>
   ),
   thead: ({ children }) => (
      <thead className="bg-muted/50">
         {children}
      </thead>
   ),
   th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
         {children}
      </th>
   ),
   td: ({ children }) => (
      <td className="border border-border px-4 py-2 text-muted-foreground">
         {children}
      </td>
   ),
   ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 text-foreground">
         {children}
      </ul>
   ),
   ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 text-foreground">
         {children}
      </ol>
   ),
   li: ({ children }) => (
      <li className="text-foreground ml-2">
         {children}
      </li>
   ),
};

function CodeBlock({ children, className, ...props }: CodeComponentProps) {
   const size = useContext(MarkdownSizeContext);
   const match = /language-(\w+)/.exec(className || '');

   if (match) {
      const lang = match[1];
      return (
         <div className="rounded-lg my-4 overflow-hidden shadow-sm">
            <Codebar lang={lang} codeString={String(children)} />
            <ShikiHighlighter
               language={lang}
               theme={'laserwave'}
               className="text-sm font-mono bg-[#27212F] p-0.5"
               showLanguage={false}
            >
               {String(children)}
            </ShikiHighlighter>
         </div>
      );
   }

   const inlineCodeClasses =
      size === 'small'
         ? 'mx-1 px-1.5 py-0.5 text-xs font-mono bg-sidebar-accent text-foreground rounded'
         : 'mx-1 px-2 py-1 text-sm font-mono bg-sidebar-accent text-foreground rounded';

   return (
      <code className={inlineCodeClasses} {...props}>
         {children}
      </code>
   );
}

function Codebar({ lang, codeString }: { lang: string; codeString: string }) {
   const [copied, setCopied] = useState(false);

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(codeString);
         setCopied(true);
         setTimeout(() => {
            setCopied(false);
         }, 2000);
      } catch (error) {
         console.error('Failed to copy code to clipboard:', error);
      }
   };

   return (
      <div className="flex justify-between items-center px-4 py-1 bg-[#362D3D] border-b border-border/50 text-sidebar-foreground/100">
         <div className="flex items-center gap-2">
            <span className="text-sm font-mono capitalize font-medium">
               {lang}
            </span>
         </div>
         <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-2 text-sm hover:bg-background/20 rounded transition-colors"
         >
            {copied ? (
               <>
                  <Check className="w-4 h-4" />
               </>
            ) : (
               <>
                  <Copy className="w-4 h-4" />
               </>
            )}
         </button>
      </div>
   );
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
   const tokens = marked.lexer(markdown);
   return tokens.map((token) => token.raw);
}

function PureMarkdownRendererBlock({ content }: { content: string }) {
   return (
      <ReactMarkdown
         remarkPlugins={[remarkGfm, [remarkMath]]}
         rehypePlugins={[rehypeKatex]}
         components={components}
      >
         {content}
      </ReactMarkdown>
   );
}

const MarkdownRendererBlock = memo(
   PureMarkdownRendererBlock,
   (prevProps, nextProps) => {
      if (prevProps.content !== nextProps.content) return false;
      return true;
   }
);

MarkdownRendererBlock.displayName = 'MarkdownRendererBlock';

const MemoizedMarkdown = memo(
   ({
      content,
      id,
      size = 'default',
   }: {
      content: string;
      id: string;
      size?: MarkdownSize;
   }) => {
      const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

      const proseClasses =
         size === 'small'
            ? 'prose prose-sm dark:prose-invert break-words max-w-none w-full prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0 text-[#F2EBFA]'
            : 'prose prose-base dark:prose-invert break-words max-w-none w-full prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0 text-[#F2EBFA]';

      return (
         <MarkdownSizeContext.Provider value={size}>
            <div className={proseClasses}>
               {blocks.map((block, index) => (
                  <MarkdownRendererBlock
                     content={block}
                     key={`${id}-block-${index}`}
                  />
               ))}
            </div>
         </MarkdownSizeContext.Provider>
      );
   }
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default MemoizedMarkdown;