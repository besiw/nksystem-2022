import React, { useState } from 'react';
import { Page, pdfjs } from 'react-pdf';
import { Document } from 'react-pdf/dist/esm/entry.webpack';

pdfjs.GlobalWorkerOptions.workerSrc = `/cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js`;

function MyApp({ url }) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ fileNumPages }) {
		setNumPages(fileNumPages);
	}
	return (
		<div>
			{url && (
				<div style={{ height: '80vh' }}>
					<embed src={url} width="100%" height="100%" className="overflow-scroll" />
				</div>
			)}
		</div>
	);
}

export default MyApp;
