import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface IMessageRendererProps {
  content: string;
  className?: string;
}

const MessageRenderer = ({
  content,
  className = "",
}: IMessageRendererProps) => {
  return (
    <div
      className={`prose prose-invert max-w-full overflow-hidden break-words ${className}`}
    >
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code(props: any) {
            const { inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              // Block code with language specified
              return (
                <div className="relative max-w-full overflow-hidden">
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded z-10">
                    {language}
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={
                      {
                        margin: "0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        maxWidth: "100%",
                        width: "100%",
                        overflow: "hidden",
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      } as React.CSSProperties
                    }
                    {...rest}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            } else if (!inline) {
              // Block code without language specified
              return (
                <div className="max-w-full overflow-hidden">
                  <SyntaxHighlighter
                    style={oneDark}
                    language="text"
                    PreTag="div"
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={
                      {
                        margin: "0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        maxWidth: "100%",
                        width: "100%",
                        overflow: "hidden",
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      } as React.CSSProperties
                    }
                    {...rest}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            } else {
              // Inline code
              return (
                <code
                  className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono break-words"
                  {...rest}
                >
                  {children}
                </code>
              );
            }
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside mb-2 space-y-1">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside mb-2 space-y-1">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="text-sm">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-bold mb-2">{children}</h3>;
          },
          strong({ children }) {
            return <strong className="font-semibold">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic">{children}</em>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 my-2">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
