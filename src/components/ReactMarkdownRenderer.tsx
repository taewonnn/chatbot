import ReactMarkdown from 'react-markdown';

interface IMarkdownRenderer {
  content: string;
}

export default function MarkdownRenderer({ content }: IMarkdownRenderer) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
              <code className="rounded bg-gray-100 px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            ) : (
              <pre className="overflow-x-auto rounded-lg bg-gray-100 p-3">
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
