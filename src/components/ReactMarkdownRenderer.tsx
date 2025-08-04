import ReactMarkdown from 'react-markdown';

interface IMarkdownRenderer {
  content: string;
}

export default function MarkdownRenderer({ content }: IMarkdownRenderer) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // p 태그 -> div로 변경
          p: ({ children }: any) => <div className="mb-2">{children}</div>,
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code className="theme-bg-tertiary rounded px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            ) : (
              <pre className="theme-bg-tertiary overflow-x-auto rounded-lg p-3">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          a: ({ children, href }: any) => (
            <a
              href={href}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }: any) => (
            <ul className="my-2 list-inside list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }: any) => (
            <ol className="my-2 list-inside list-decimal space-y-1">{children}</ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
