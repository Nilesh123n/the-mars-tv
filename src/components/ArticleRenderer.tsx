import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

interface ArticleRendererProps {
  content: string;
  fontSize?: 'normal' | 'large' | 'xlarge';
  className?: string;
}

/**
 * Normalizes raw article text so that:
 * 1. Line breaks & paragraph breaks (\n\n, \n) are properly converted.
 * 2. Bold tags (<b>, <strong>, **bold**) and italics (*italic*, <i>, <em>) render sharply.
 * 3. Bullet marks (•, ●, ▪) convert into clean unordered lists.
 * 4. Numbered lines (1) item) convert into ordered lists.
 * 5. Headings (###, <h3>, <h2>) get proper vertical spacing and typography.
 */
export function normalizeArticleContent(rawContent: string): string {
  if (!rawContent) return '';

  let content = rawContent.trim();

  // Normalize all Windows/Mac carriage returns
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Convert raw unicode bullet symbols at the start of a line to standard markdown list items
  content = content.replace(/^[ \t]*[•●▪‣][ \t]*/gm, '- ');

  // Convert numbered lists like "1) item" to "1. item"
  content = content.replace(/^[ \t]*(\d+)\)[ \t]*/gm, '$1. ');

  // If text is plain text (no HTML tags) and contains single newlines without double newlines,
  // ensure each paragraph gets a distinct double-line break for clear paragraph separation
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (!hasHtml) {
    // If the text does not have double newlines, treat single newlines as paragraph boundaries
    if (!content.includes('\n\n') && content.includes('\n')) {
      const lines = content.split('\n').map((l) => l.trim());
      content = lines.filter(Boolean).join('\n\n');
    }
  }

  return content;
}

export default function ArticleRenderer({
  content,
  fontSize = 'normal',
  className = '',
}: ArticleRendererProps) {
  const normalized = React.useMemo(() => normalizeArticleContent(content), [content]);

  // Dynamic font sizing classes
  const fontClasses = {
    normal: {
      p: 'text-[16px] sm:text-[16.5px] leading-[1.85] mb-5',
      heading1: 'text-[22px] sm:text-[26px] mt-8 mb-4',
      heading2: 'text-[19px] sm:text-[22px] mt-7 mb-3.5',
      heading3: 'text-[17px] sm:text-[19px] mt-6 mb-3',
      list: 'text-[16px] sm:text-[16.5px] space-y-2 mb-5',
    },
    large: {
      p: 'text-[18px] sm:text-[18.5px] leading-[1.9] mb-6',
      heading1: 'text-[24px] sm:text-[28px] mt-9 mb-4.5',
      heading2: 'text-[21px] sm:text-[24px] mt-8 mb-4',
      heading3: 'text-[19px] sm:text-[21px] mt-7 mb-3.5',
      list: 'text-[18px] sm:text-[18.5px] space-y-2.5 mb-6',
    },
    xlarge: {
      p: 'text-[20px] sm:text-[21px] leading-[1.95] mb-7',
      heading1: 'text-[26px] sm:text-[30px] mt-10 mb-5',
      heading2: 'text-[23px] sm:text-[26px] mt-9 mb-4.5',
      heading3: 'text-[21px] sm:text-[23px] mt-8 mb-4',
      list: 'text-[20px] sm:text-[21px] space-y-3 mb-7',
    },
  }[fontSize];

  return (
    <div className={`article-content-wrapper text-gray-800 ${className}`}>
      <Markdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => (
            <p className={`${fontClasses.p} text-gray-800 font-normal tracking-[0.01em] last:mb-0`}>
              {children}
            </p>
          ),
          h1: ({ children }) => (
            <h1
              className={`${fontClasses.heading1} font-extrabold text-[#111111] leading-tight tracking-tight border-b border-gray-100 pb-2`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={`${fontClasses.heading2} font-bold text-[#111111] leading-snug tracking-tight`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={`${fontClasses.heading3} font-bold text-[#111111] leading-snug`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              className="text-[16px] sm:text-[17px] font-bold text-[#111111] mt-5 mb-2 leading-snug"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {children}
            </h4>
          ),
          strong: ({ children }) => (
            <strong className="font-extrabold text-[#111111] tracking-normal">
              {children}
            </strong>
          ),
          b: ({ children }) => (
            <b className="font-extrabold text-[#111111] tracking-normal">
              {children}
            </b>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">
              {children}
            </em>
          ),
          i: ({ children }) => (
            <i className="italic text-gray-800">
              {children}
            </i>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc pl-6 ${fontClasses.list} text-gray-800 marker:text-[#D61F26] marker:font-bold`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal pl-6 ${fontClasses.list} text-gray-800 marker:text-[#D61F26] marker:font-extrabold`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.8] pl-1.5 font-medium text-gray-800">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-[4px] border-[#D61F26] pl-5 py-3.5 my-6 bg-gradient-to-r from-red-50/70 via-red-50/30 to-transparent rounded-r-2xl text-gray-800 italic text-[16px] sm:text-[17px] leading-[1.8] font-medium shadow-xs">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-t-2 border-gray-100" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D61F26] underline hover:text-[#B01920] font-semibold transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {normalized}
      </Markdown>
    </div>
  );
}
