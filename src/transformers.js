
var transformers = [ejs];

export default transformers;

function ejs(input, extname) {

	if (extname == ".ejs") {
		return input.split(/<%-|<%=|<%|%>/g).filter((_, i) => i % 2 != 0).join("\n");
	}

	return input;
}
