// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
//var GLOBALOBJECT=this; //must be outside any function


jsindentator={}; //global
var ns = jsindentator;

/**
This is not really a class but a static object that comply with this description.
Alias in code: ns
@class jsindentator
*/
_.extend(ns, {
	
	/**
	current block indentation counter. Can be useful for indenting blocks
	@property blockCount
	*/
	blockCount: 0  
	/**
	@method print
	*/
,	print: function(str) {
		ns.buffer.push(str); 
	}
,	_printIndent: function(num) {
		for(var i = 0; i<num; i++) {
			ns.print(ns.tab); 
		}
	}
	/**
	@method printIndent
	*/
,	printIndent: function(nonl) {
		if(!nonl)
			ns.buffer.push(ns.newline); 
		ns._printIndent(ns.blockCount); 
	}

	/**
	@property {Object} styles
	*/
,	styles: {}

,	originalCode: function(node) {
		if(!node.range)
			return ''; 
		if(node.range.length==1)
			return ns.code.substring(node.range[0], node.range[0+1]); 
		else
			return ns.code.substring(node.range[0], node.range[1]); 
	}
,	buffer: []
,	reset: function(){
		ns.nodeIdCounter=0;
	}
,	setStyle: function(style) {
		this.reset();
		ns.visitors=style; 
		if(style.installStyle && _.isFunction(style.installStyle)) {
			style.installStyle();
		}
	}

	/**
	@method main
	@param code {String}
	@param config {Object} optional
	@return {Any} the result of performing the source code transformation accordin g to the urrent visitor. 
	*/
,	main: function (code, config) {	
		if(config && !ns.visitors.setStyleConfig) {
			_.extend(ns, config); 
		}
		else if(config && ns.visitors.setStyleConfig) {
			ns.visitors.setStyleConfig(config); 
		}
		
		ns.code = code;
		
		var syntax = null;
		try {
			syntax = esprima.parse(code, {
				raw: true						
			,	range: true
			,	comment: true
//				,	tokens: true
//				,	loc : true
				}				
			);
		}
		catch(ex){
			return ex;
		}
		ns.syntax = syntax; 

		// ns.visitors.preproccess && ns.visitors.preproccess();

		ns.buffer = [];
		_(syntax.body).each(function(node){
			ns.visit(node); 
		}); 
		
		//postRender
		ns.buffer = ( ns.visitors.postRender && ns.visitors.postRender() ) || ns.buffer;
		
		return ns.buffer.join('');  
	}


/* 

this is the public visit() method which all the visitors will call for sub concept instances, 
like for example the FunctionExpression will call for render its parameter expression and its body
 statements. the visit method will delegate to registered visitor for the given type of by default, 
 if no visitor is registered for that concept it will just dump the original code. */ 

,	visit: function(node, config, parentNode, parentPropertyName) {
	 	if(!node) 
	 	{
	 		return; 
	 	}	 
	 	//do the visiting
		var visitor = ns.visitors[node.type]; 
		if (visitor) 
		{
			ns._checkComments(node);
			if (parentNode)
			{
				node.parentNode=parentNode;
			}
			visitor.apply(ns.visitors, [node, config]); 
			if(ns.visitors.visit) 
			{
				ns.visitors.visit.apply(this, [node, config, parentNode, parentPropertyName]); 
			}
		}
		else 
		{
			var origCode = ns.originalCode(node);
			console.log("WARNING - Language concept not supported ", node, origCode); 
			ns.buffer.push(origCode);
		}
	}

// in esprima there are no comment nodes, just comment meta information so we need to build 
// the comments by our self. TODO: make this work OK. 
,	_checkComments: function(node) {

		var previousNodeRange = ns._comments_currentNodeRange || [0,0]; 
		ns._comments_currentNodeRange=node.range || [0,0]; 
		for ( var i = 0; i < ns.syntax.comments.length; i++) //TODO: do it efficient- save previsou comment node.
		{ 
			var c = ns.syntax.comments[i]; 
			// console.log('COMPARING', c.range, previousNodeRange, ns._comments_currentNodeRange); 
			if(c.range[0] >= previousNodeRange[1] && c.range[1] <= ns._comments_currentNodeRange[0]) 
			{
				ns.visit(c); 
				break; 
			}
		}
	}
	
,	logMessages: []
,	log: function(msg) {
		logMessages.push(msg); 
	}
,	setConfig: function(config) {
		_.extend(ns, config); 
	}
});

/**
instantiable jsindentator - this will only work if the indentator impl's main is synchronous
@class JsIndentator
*/
ns.JsIndentator = function() {		
}; 
/**
@method setStyle
*/
ns.JsIndentator.prototype.setStyle = function(style){
	ns.setStyle(style); 
}; 
/**
@method main
*/
ns.JsIndentator.prototype.main = function(code, config){
	this.inputCode=code;
	this.code = ns.main(code, config); 
	this.buffer=ns.buffer;
	this.syntax=ns.syntax; 
	return this.code;
};

/**
User must provide a JsVisitor implementation instance that can be or extend one of the ones in src/styles implementation examples. 
That instance must implement this class, JsVisitor. Reference JsVisitor implementation is styles/style_clean.js and can be extended
@class JsVisitor
*/
/**
@method setStyle
*/
/**
@method visit
*/