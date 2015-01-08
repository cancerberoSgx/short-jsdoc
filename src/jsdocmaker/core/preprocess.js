
//COMMENT PREPROCESSORS

//@method preprocessComments do an initial preprocesing on the comments erasing those marked to be ignored, and fixing its text to support alternative syntax.
JsDocMaker.prototype.preprocessComments = function()
{
	//we do the parsing block by block,
	for (var i = 0; i < this.comments.length; i++) 
	{
		var node = this.comments[i]; 
		node.value = node.value || ''; 

		// fix styled comment blocks with '*' as new line prefix
		if(node.type === 'Block')
		{
			// Note: syntax /** - not necesary to implement
			node.value = node.value.replace(/\n \*/gi, '\n');
		}

		// remove comments that starts with ignoreCommentPrefix
		if(JsDocMaker.startsWith(JsDocMaker.stringTrim(node.value), this.ignoreCommentPrefix))
		{
			//if \n * is detected it is fixed to not count the decorative '*'
			this.comments.splice(i, 1); //remove this node
		}
	}
}; 
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.preprocessComments); 


//@method fixUnamedAnnotations - our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to 
//precondition
JsDocMaker.prototype.fixUnamedAnnotations = function()
{
	_(this.comments).each(function(node)
	{
		if(node.value)
		{
			node.value = node.value.replace(/@constructor/gi, '@constructor n'); 
			// node.value = node.value.replace(/@throw/gi, '@throws n'); 
			// node.value = node.value.replace(/@throws/gi, '@throws n'); 
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	});
};
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.fixUnamedAnnotations); 


// @method unifyLineComments unify adjacents Line comment nodes into one in the ns.syntax.coments generated after visiting. 
JsDocMaker.prototype.unifyLineComments = function()
{
	var i = 0;
	
	//@property {String} lineCommentSeparator used to separate each Line comment type text
	this.lineCommentSeparator = this.lineCommentSeparator || ' '; 

	while(i < this.comments.length - 1)
	{
		var c = this.comments[i]
		,	next = this.comments[i+1]; 

		var sss = JsDocMaker.stringFullTrim(this.data.source.substring(c.range[1], next.range[0])); 
		if (c.type==='Line' && next.type==='Line' && !sss)
		{
			c.value += ' ' + this.lineCommentSeparator + ' ' + next.value; 
			c.range[1] = next.range[1]; 
			this.comments.splice(i+1, 1); 
		}
		else
		{
			i++;
		}
	}
}; 

//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.unifyLineComments); 
