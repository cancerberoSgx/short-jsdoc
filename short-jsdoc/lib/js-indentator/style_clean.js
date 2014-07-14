// This implementation is the official one for extending user visirot implementation, see style_springly_extractor. It collect
// all supported aditional meta information defined in jsindentator.js like parentNode, parentPropertyName
// in this code node name means javascript language ast nodes like expression, declaration, statement, etc, not DOM or xml nodes!
// style clean can be used for those concrete data generation tools only for make sure every ast node is iterated. 
// It also support the config.saveParents config prop for saving the parent node
// TODO: only single line code supported !
(function() {
var ns = jsindentator, print=ns.print; 
if(!jsindentator.styles)jsindentator.styles={};
var visit=ns.visit;
//var visit=function(child, config, parent) {
//	config=config||{};
//	config.parentNode=parent?parent:null;		
//	ns.visit(child, config)
//}
jsindentator.styles.clean = {
	
	"VariableDeclaration" : function(node, config) {
		print('var '); 
		for ( var i = 0; i < node.declarations.length; i++) {
			visit(node.declarations[i], {}, node, 'declarations'); 
			if(i< node.declarations.length-1)
				print(',');
		}
		if(!config || !config.noLastSemicolon) 
			print(';'); 
	}

,	"VariableDeclarator" : function(node, config) {
//		ns.print(node.id.name);
		visit(node.id, {}, node, 'id');
		if(node.init) {
			print("="); 
			visit(node.init, {}, node, 'init');
		}
	}
	
	

,	"Literal" : function(node) {
		print(node.raw); 
	}
,	"Identifier": function(node) {
		print(node.name || ''); 
	}
,	"FunctionExpression": function(node) {
		print('function ');
		visit(node.id, {}, node, 'id');
		print('('); 
		for( var i = 0; i < node.params.length; i++) {
			visit(node.params[i], {}, node, 'params_'+i); 
			if(i < node.params.length-1)
				print(',');					
		}
		print('){');
		ns.blockCount++;
		visit(node.body, {}, node, 'body'); 
		ns.blockCount--;
		print('}'); 
	}
,	"BlockStatement": function(node) {	
		for ( var i = 0; i < node.body.length; i++) {
			visit(node.body[i], {}, node, 'body_'+i);
		}
	}
,	"UpdateExpression": function(node) {				  
		if(node.prefix) {
			print(node.operator);
			visit(node.argument, {}, node, 'prefix'); 
		}
		else {
			visit(node.argument, {}, node, 'argument'); 
			print(node.operator);
		}
	}
	
,	"ForStatement": function(node) {
		print('for('); 
		visit(node.init, {noFirstNewLine: true}, node, 'init');
//				print('; '); 
		visit(node.test, {}, node, 'test');
		print(';');
		visit(node.update, {}, node, 'update');
		print('){'); 
//				ns.printIndent(); 
		ns.blockCount++;
		visit(node.body, {}, node, 'body');
		ns.blockCount--;
//		ns.printIndent(); 
		print('};'); 
	}
,	"ArrayExpression": function(node) {	
		print('['); 
		for ( var i = 0; i < node.elements.length; i++) {
			visit(node.elements[i], {}, node);
			if(i < node.elements.length-1)
				print(',');
		}
		print(']'); 
	}

,	"ExpressionStatement": function(node) {
		visit(node.expression, {}, node);
		print(';'); 
	}
,	"CallExpression": function(node) {	
		if(node.callee.type==="FunctionExpression"){print('(');ns.blockCount++;}//hack - parenthesis around functions
		visit(node.callee, {}, node)
		if(node.callee.type==="FunctionExpression"){print(')');ns.blockCount--;}//hack - parenthesis around functions
		print('('); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i], {}, node);
			if(i < node.arguments.length-1)
				print(',');
		}
		print(')'); 
	}
,	"BinaryExpression": function(node) {
		visit(node.left, {}, node); 
		print(node.operator==='in'?' in ':node.operator); 
		visit(node.right, {}, node); 
	}

,	"ObjectExpression": function(node) {
		print('{'); 
		ns.blockCount++;
		for ( var i = 0; i < node.properties.length; i++) {
			var p = node.properties[i];
			
			visit(p.key, {}, node); //Identifier
			print(':'); 
			visit(p.value, {}, node); //*Expression
			if(i < node.properties.length-1) {
				print(','); 
			}
		}
		ns.blockCount--;
		print('}'); 
	}
,	"ReturnStatement": function(node) {
		print('return '); 
		visit(node.argument, {}, node); 
		print(';'); 
	}

,	"ConditionalExpression": function(node) {
		visit(node.test, {}, node); 
		print('?'); 
		visit(node.consequent, {}, node);
		print(':'); 
		visit(node.alternate, {}, node);
	}
,	"EmptyStatement": function(node) {
		print(';'); 
	}

,	"SwitchStatement": function(node) {
		print('switch(');
		visit(node.discriminant, {}, node); 
		print('){');
		for(var i = 0; i < node.cases.length; i++) {
			visit(node.cases[i], {}, node); 
		}
		print('}'); 
	}
,	"SwitchCase": function(node) {
		print(node.test==null ? 'default' : 'case ');
		visit(node.test, {}, node); 
		print(':'); 
		for(var i = 0; i < node.consequent.length; i++) {			
			visit(node.consequent[i], {}, node); 
		}
	}
,	"BreakStatement": function(node) {
		print('break;');
	}

,	"WhileStatement": function(node) {
		print('while(');
		visit(node.test, {}, node); 
		print('){');
		ns.blockCount++;
		visit(node.body, {}, node);
		ns.blockCount--;
		print('}'); 
	}
,	"AssignmentExpression": function(node) {
		visit(node.left, {}, node);
		print(node.operator); 
		visit(node.right, {}, node); 
	}
,	"MemberExpression": function(node) {
		visit(node.object, {}, node);
		print('.'); 
		visit(node.property, {}, node); 
	}

,	"ThisExpression": function(node) {
		print('this');  
	}

,	"SequenceExpression": function(node) {
		print('(');   
		for ( var i = 0; i < node.expressions.length; i++) {
			visit(node.expressions[i], {}, node);
			if(i < node.expressions.length-1)
				print(',');
		}
		print(')');
	}
,	"DoWhileStatement": function(node) {
		print('do{');
		visit(node.body, {}, node);
		print("}while(");
		visit(node.test, {}, node);
		print(');');
	}

,	"NewExpression": function(node) {
		print('new '); 
		visit(node.callee, {}, node); 
		print('('); 
		for ( var i = 0; i < node.arguments.length; i++) {
			visit(node.arguments[i], {}, node);
			if(i < node.arguments.length-1)
				print(',');
		}
		print(')'); 
	}
,	"WithStatement": function(node) {
		print('with('); 
		visit(node.object, {}, node); 
		print(')'); 
		print('{')
		ns.blockCount++;
		visit(node.body, {}, node);
		ns.blockCount--;
		print('};');
	}

,	"IfStatement": function(node, config) {
		print('if('); 
		visit(node.test, {}, node); 
		print(')'); 		
		print('{');
		ns.blockCount++;
		visit(node.consequent, {}, node);
		ns.blockCount--;
		if(node.alternate) {
			print('}else ');//TODO: this space can be better minified
			if(node.alternate.test==null) {
				print('{');
				ns.blockCount++;	
				visit(node.alternate, {noFirstNewLine: true}, node);
				ns.blockCount--;
				print('}');
			}
			else
				visit(node.alternate, {noFirstNewLine: true}, node);
		}
	}

,	"FunctionDeclaration": function(node, config) {
		print('function');
		if(node.id) {
			print(' ');
			visit(node.id, {}, node); 
		} 
		print('('); 
		if(node.params) for ( var i = 0; i < node.params.length; i++) {
			visit(node.params[i], {}, node); 
			if(i< node.params.length-1)
				print(','); 		 
		}
		print('){');
		ns.blockCount++;
		visit(node.body, {}, node); 
		ns.blockCount--;
		print('}');
	}
,	"UnaryExpression": function(node) {
		print(node.operator);
		visit(node.argument, {}, node); 
	}
,	"LogicalExpression": function(node) {
		visit(node.left, {}, node); 
		print(node.operator); 
		visit(node.right, {}, node); 
	}
,	"TryStatement": function(node) {
		print('try{');
		ns.blockCount++;
		visit(node.block, {}, node); 
		ns.blockCount--;
		print('}');
		for ( var i = 0; i < node.handlers.length; i++) {
			visit(node.handlers[i], {}, node); 
		}
		if(node.finalizer) {
			print('finally'); 
			print('{');
			ns.blockCount++;
			visit(node.finalizer, {}, node); 
			ns.blockCount--;
			print('}');
		}
	}
,	"CatchClause": function(node) {
		print('catch('); 
		if(node.params) for ( var i = 0; i < node.params.length; i++) {
			visit(node.params[i], {}, node); 
			if(i< node.params.length-1)
				print(','); 		 
		}
		print('){');
		ns.blockCount++;
		visit(node.body, {}, node); 
		ns.blockCount--;
		print('}');
	}
,	"ThrowStatement": function(node) {
		print('throw '); 
		visit(node.argument, {}, node);
		print(';')
	}

,	"ForInStatement": function(node) {
		print("for("); 
		visit(node.left, {noFirstNewLine: true, noLastSemicolon: true}, node); 	
		print(' in '); 
		visit(node.right, {}, node); 
		print(')')		
		print('{');
		ns.blockCount++;
		visit(node.body, {}, node); 
		ns.blockCount--;
		print('}');
	}
,	"ContinueStatement": function(node){
		print('continue;'); 
	}

,	"Block": function(node) {/* support for block comments like this one*/
	}
,	"Line": function(node) {//support for line comments like this one
	}
}
})();



