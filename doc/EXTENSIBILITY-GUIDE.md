# Extendable

The parser read the sources and generate a Abstract Syntax Tree (AST) of ALL the @annotations. THEN it is 'beautified' with shortcuts for properties and methods. But the original AST with ALL the annotations is there for those who want to define its own semantics and annotations. 

## Extensibility 1: jsdoc AST Postprocessing

The parser read the sources and generate a Abstract Syntax Tree (AST) of ALL the @annotations. THEN it is 'beautified' with shortcuts for properties and methods. But the AST is there for those who want to define its own semantics and annotations. For example, you want to use your own custom annotation, let's say, @versionfoo to indicate you method's, classes', properties etc version you could do something like the following (ready to run) test

    // the code to be parsed - note that it contains some custom @versionfoo annotations
    var code = 
        '//@module office @versionfoo 3.2' + '\n' + 
        '//@class Computer' + '\n' +
        '//you can do excel here' + '\n' +
        '//@versionfoo 1.2' + '\n' +
        '//@method putmusic @param {Object<String,Array<Song>>} songs' + '\n' + 
        '//@versionfoo 1.0' + '\n' +
        '';

    //instantiate the parser and parse
    var maker = new JsDocMaker();
    maker.parseFile(code); 
    maker.postProccess();
    maker.postProccessBinding();    
    var jsdoc = maker.data;

    // we define a function to visit each AST node - we will search for a children @versionfoo and if any set as a property
    var astVisitor = function(node)
    {
        var versionfoo = _(node.children||[]).find(function(child)
        {
            return child.annotation === 'versionfoo'; 
        });
        if(versionfoo && versionfoo.name)
        {
            node.versionfoo = versionfoo.name; 
        }
    }; 
    maker.recurseAST(astVisitor); 
    expect(jsdoc.modules.office.versionfoo).toBe('3.2');

After this we can easily access the @versionfoo of any node like for example, the following expression:

    jsdoc.modules.office.versionfoo === '3.2'



## Extensibility 2: Source comments preprocessing

Also another kind of extension / plugin is available for preprocessing the source comments, for example for removing or adding something. In the following example we remove a string and add some extra information to all our comments of type line:

    var code = 
        '//@module stuff3' + '\n' + 
        '/**@class Vanilla some text @author sgx */' + '\n'; 
        
    var maker = new JsDocMaker();
    
    //define a comment preprocessor
    var my_preprocessor = function()
    {
        for (var i = 0; i < this.comments.length; i++) 
        {
            var node = this.comments[i]; 
            node.value = node.value.replace(/@author\s+\w+/gi, '') + ' @author thief'; 
        }
    }; 
    //and install it
    maker.commentPreprocessors.push(my_preprocessor);
    
    //then do the parsing
    maker.parseFile(code); 
    maker.postProccess();
    maker.postProccessBinding();
    var jsdoc = maker.data;
    
    var Vanilla = jsdoc.classes['stuff3.Vanilla'];
    var author = _(Vanilla.children).find(function(c){return c.annotation === 'author'; });
    expect(author.name).toBe('thief');



##Extensibility 3: Custom type sytax

shortjsdoc supports a general way of defining Custom types. In gneral we register a custom type that defines its name and a function that will process the custom type input string and output the type object. 

In the following example we define a custom type syntax like @returns {#lemmon(acid,yellow)} that will parse that string in an object like {type:'Object', lemmonProperties:['acid','yellow']}. As you can see the AST type object semantics is defined 100% by the parser:

    var code = 
        '//@module customTypeParsers' + '\n' +  
        '/*@class Vanilla some text ' + '\n' +  
        '@method method1' + '\n' +  
        '@return {#lemmon(acid,lazy,green)} */' + '\n' +
        ''; 

    var maker = new JsDocMaker();

    // define and regiter a custom type syntax:
    var customTypeParser = {
        name: 'lemmon'  
    ,   parse: function(s)
        {
            // variable s is the text body of the custom type for example 'acid,lazy,green'.
            // we return the following object as this type obejct implementation.
            return {
                name: 'Object'
            ,   lemmonProperties: s.split(',')
            }; 
        }
    };
    maker.registerTypeParser(customTypeParser); 

    //then do the parsing
    maker.parseFile(code); 
    maker.postProccess();
    maker.postProccessBinding();
    var jsdoc = maker.data;

    var Vanilla = jsdoc.classes['customTypeParsers.Vanilla'];
    var return1 = Vanilla.methods.method1.returns.type; 
    expect(return1.lemmonProperties[0]).toBe('acid'); 
    expect(return1.lemmonProperties[1]).toBe('lazy'); 
    expect(return1.lemmonProperties[2]).toBe('green'); 
    expect(return1.name).toBe('Object'); 

Notice that the literal object type syntax '{#obj(name:String)}' is just one of these custom-type-plugins. 
