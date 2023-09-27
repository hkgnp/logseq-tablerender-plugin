import { ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export const checkCell = (
  path: string,
  graphName: string,
  content: string,
): ReactNode | string => {
  if (!content) return;
  let str: ReactNode[] | string = content;

  //  Check for block
  const uuid = /id\:\:(.*)/.exec(content);
  if (uuid) {
    const contentText = content.substring(0, content.indexOf("id:: "));
    str = reactStringReplace(contentText, contentText, (match) => (
      <a href={`logseq://graph/${graphName}?block-id=${uuid[1]?.trim()}`}>
        {match}
      </a>
    ));
  }

  // Check for page
  const rxPageRef = /(\[\[(.*?)\]\])/g;
  const matchedPageRefArray = [...content.matchAll(rxPageRef)];

  if (matchedPageRefArray.length > 0) {
    for (const m of matchedPageRefArray) {
      const elem = (
        <a href={`logseq://graph/${graphName}?page=${m[2]}`}>{m[2]}</a>
      );
      str = reactStringReplace(str, m[1], () => elem);
    }
  }

  // Check for image
  const rxImgRef = /\!\[(.*?)\}/g;
  const matchedImgRefArray = [...content.matchAll(rxImgRef)];

  if (matchedImgRefArray.length > 0) {
    for (const i of matchedImgRefArray) {
      const filename = /\(\.\.\/assets\/(.*?)\)/.exec(i[1]!)![1];
      const height = /\:height(.*?)(\d+)/.exec(i[0])![2];
      const width = /\:width(.*?)(\d+)/.exec(i[0])![2];
      const elem = (
        <img
          src={`assets://${path}/assets/${filename}`}
          height={height}
          width={width}
        />
      );
      str = reactStringReplace(str, i[0], () => elem);
    }
  }

  return str;
};
