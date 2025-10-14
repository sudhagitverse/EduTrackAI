import { Document, Page } from "react-pdf";
import React from "react";

const PDFViewer = ({ url }) => {
    return (
        <div>
            <Document file={url}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
};

export default PDFViewer;
