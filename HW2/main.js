var ListIterator = require('list-iterator');
var esprima = require("esprima");
var options = {
    tokens: true,
    tolerant: true,
    loc: true,
    range: true
};
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');
var Random = require('random-js');

function main() {
    var args = process.argv.slice(2);

    if (args.length == 0) {
        args = ["subject.js"];
    }
    var filePath = args[0];

    constraints(filePath);

    generateTestCases()

}

var engine = Random.engines.mt19937().autoSeed();

function createConcreteIntegerValue(greaterThan, constraintValue) {
    if (greaterThan)
        return Random.integer(constraintValue, constraintValue + 10)(engine);
    else
        return Random.integer(constraintValue - 10, constraintValue)(engine);
}

function Constraint(properties) {
    this.ident = properties.ident;
    this.expression = properties.expression;
    this.operator = properties.operator;
    this.value = properties.value;
    this.funcName = properties.funcName;
    // Supported kinds: "fileWithContent","fileExists"
    // integer, string, phoneNumber
    this.kind = properties.kind;
}

function fakeDemo() {
    console.log(faker.phone.phoneNumber());
    console.log(faker.phone.phoneNumberFormat());
    console.log(faker.phone.phoneFormats());
}

var functionConstraints = {}

var mockFileLibrary = {
    pathExists: {
        'path/fileExists': {},
        'path/filePresent': {
            "test.txt": "testing"
        }
    },
    fileWithContent: {
        pathContent: {
            file1: 'text content',
            file2: '',
        }
    }
};


var phoneOptions = [{
    'normalize': true
}, {
    'shouldNormalize': true
}];

function generateTestCases() {

    var content = "var subject = require('./subject.js')\nvar mock = require('mock-fs');\n";
    for (var funcName in functionConstraints) {
        var params = {};

        // initialize params
        for (var i = 0; i < functionConstraints[funcName].params.length; i++) {
            var paramName = functionConstraints[funcName].params[i];
            //params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
            // params[paramName] = '\'\'';
            params[paramName] = [];
        }

        // console.log( "****TEST****" + JSON.stringify(params ));

        // update parameter values based on known constraints.
        var constraints = functionConstraints[funcName].constraints;



        // Handle global constraints...
        var fileWithContent = _.some(constraints, {
            kind: 'fileWithContent'
        });
        var pathExists = _.some(constraints, {
            kind: 'fileExists'
        });
        var phone = _.contains(functionConstraints[funcName].params, "phoneNumber");


        for (var c = 0; c < constraints.length; c++) {

            var constraint = constraints[c];



            if (params.hasOwnProperty(constraint.ident)) {

                params[constraint.ident].push(constraint.value);
            }

            // var args = Object.keys(params).map(function(k) {
            //     return params[k];
            // }).join(",");

        }

        var argCom = [];
        argCom = combinations(params);

        // console.log(argCom);

        for (var i = 0; i < argCom.length; i++) {
            var args = [];
            args = argCom[i];
            content += "subject.{0}({1});\n".format(funcName, args);
        }

        // for(var arg in argCom){
        //  console.log(arg);
        //  content += "subject.{0}({1}, {2});\n".format(funcName, arg[0], arg[1]);
        // }

        // console.log("***PARAMS***" + JSON.stringify(params));

        // content += "subject.{0}({1});\n".format(funcName, args);

        // for (var c = 1; c < constraints.length; c += 2) {

        //     var constraint = constraints[c];

        //     if (params.hasOwnProperty(constraint.ident)) {
        //         params[constraint.ident] = constraint.value;
        //     }

        //     var args = Object.keys(params).map(function(k) {
        //         return params[k];
        //     }).join(",");

        // }

        // content += "subject.{0}({1});\n".format(funcName, args);

        // console.log("***PARAMS***" + JSON.stringify(params));

        // Prepare function arguments.
        // var args = Object.keys(params).map(function(k) {
        //     return params[k];
        // }).join(",");

        // console.log("***ARGS***" + args);

        if (pathExists || fileWithContent) {



            for (var i = 0; i < argCom.length; i++) {
                var args = [];
                args = argCom[i];

                content += generateMockFsTestCases(pathExists, fileWithContent, funcName, args);
                // Bonus...generate constraint variations test cases....
                content += generateMockFsTestCases(!pathExists, fileWithContent, funcName, args);
                content += generateMockFsTestCases(pathExists, !fileWithContent, funcName, args);
                content += generateMockFsTestCases(!pathExists, !fileWithContent, funcName, args);

            }

        } else {
            // Emit simple test case.

            // content += "subject.{0}({1});\n".format(funcName, args);
        }



        if (phone) {

            for (var x = 0; x < phoneOptions.length; x++) {
                args = '';
                var option = [];
                option = phoneOptions[x];
                
                
                args += "'" + faker.phone.phoneNumber() + "','" + faker.phone.phoneFormats() + "'," + JSON.stringify(option);
                content += "subject.{0}({1});\n".format(funcName, args);
            }

        }

    }


    fs.writeFileSync('test.js', content, "utf8");

}

function generateMockFsTestCases(pathExists, fileWithContent, funcName, args) {
    var testCase = "";
    // Build mock file system based on constraints.
    var mergedFS = {};
    if (pathExists) {
        for (var attrname in mockFileLibrary.pathExists) {
            mergedFS[attrname] = mockFileLibrary.pathExists[attrname];
        }
    }
    if (fileWithContent) {
        for (var attrname in mockFileLibrary.fileWithContent) {
            mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname];
        }
    }


    testCase +=
        "mock(" +
        JSON.stringify(mergedFS) +
        ");\n";

    testCase += "\tsubject.{0}({1});\n".format(funcName, args);
    testCase += "mock.restore();\n";
    return testCase;
}

function constraints(filePath) {
    var buf = fs.readFileSync(filePath, "utf8");
    var result = esprima.parse(buf, options);

    traverse(result, function(node) {
        if (node.type === 'FunctionDeclaration') {
            var funcName = functionName(node);
            console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName));

            var params = node.params.map(function(p) {
                return p.name
            });

            // console.log("***FuncName****" + funcName);
            // console.log("***PARAMS****" + params);

            functionConstraints[funcName] = {
                constraints: [],
                params: params
            };

            // Check for expressions using argument.
            traverse(node, function(child) {

                if (child.type === 'BinaryExpression' && child.operator == "==") {
                    if (child.left.type == 'Identifier' && params.indexOf(child.left.name) > -1) {
                        // get expression from original source code:
                        var expression = buf.substring(child.range[0], child.range[1]);
                        var rightHand = buf.substring(child.right.range[0], child.right.range[1]);

                        functionConstraints[funcName].constraints.push(
                            new Constraint({
                                ident: child.left.name,
                                value: rightHand,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }));

                        if (rightHand != undefined) {

                            rightHand = parseInt(rightHand);
                            if (isNaN(rightHand)) {
                                functionConstraints[funcName].constraints.push(
                                    new Constraint({
                                        ident: child.left.name,
                                        value: '"werwde"',
                                        funcName: funcName,
                                        kind: "string",
                                        operator: child.operator,
                                        expression: expression
                                    }), new Constraint({
                                        ident: child.left.name,
                                        value: '"test"',
                                        funcName: funcName,
                                        kind: "string",
                                        operator: child.operator,
                                        expression: expression
                                    }));
                            } else {
                                functionConstraints[funcName].constraints.push(
                                    new Constraint({
                                        ident: child.left.name,
                                        value: 1,
                                        funcName: funcName,
                                        kind: "integer",
                                        operator: child.operator,
                                        expression: expression
                                    }));
                            }
                        } else {

                            functionConstraints[funcName].constraints.push(
                                new Constraint({
                                    ident: child.left.name,
                                    value: '"test"',
                                    funcName: funcName,
                                    kind: "integer",
                                    operator: child.operator,
                                    expression: expression
                                }));

                        }

                    }

                    if (child.left.type == 'Identifier' && child.left.name == "area") {

                        var expression = buf.substring(child.range[0], child.range[1]);
                        var rightHand = buf.substring(child.right.range[0], child.right.range[1])
                        var fakeNo1 = '"' + "(" + String(child.right.value) + ")" + " " + "123-4567" + '"';
                        var fakeNo2 = '"' + "(" + (parseInt(child.right.value) + 1) + ")" + " " + "123-4567" + '"';

                        functionConstraints[funcName].constraints.push(
                            new Constraint({
                                ident: params[0],
                                value: fakeNo1,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }),
                            new Constraint({
                                ident: params[0],
                                value: fakeNo2,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }));
                    }

                }

                if (child.type === 'BinaryExpression' && child.operator == "<") {
                    if (child.left.type == 'Identifier' && params.indexOf(child.left.name) > -1) {
                        // get expression from original source code:
                        var expression = buf.substring(child.range[0], child.range[1]);
                        var rightHand = parseInt(buf.substring(child.right.range[0], child.right.range[1]));

                        functionConstraints[funcName].constraints.push(
                            new Constraint({
                                ident: child.left.name,
                                value: rightHand + 1,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }),
                            new Constraint({
                                ident: child.left.name,
                                value: rightHand - 1,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }));


                    }
                }

                if (child.type === 'BinaryExpression' && child.operator == ">") {
                    if (child.left.type == 'Identifier' && params.indexOf(child.left.name) > -1) {
                        // get expression from original source code:
                        var expression = buf.substring(child.range[0], child.range[1]);
                        var rightHand = parseInt(buf.substring(child.right.range[0], child.right.range[1]));

                        functionConstraints[funcName].constraints.push(
                            new Constraint({
                                ident: child.left.name,
                                value: rightHand + 1,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }),
                            new Constraint({
                                ident: child.left.name,
                                value: rightHand - 1,
                                funcName: funcName,
                                kind: "integer",
                                operator: child.operator,
                                expression: expression
                            }));


                    }
                }

                if (child.type == "CallExpression" &&
                    child.callee.property &&
                    child.callee.property.name == "readFileSync") {
                    // console.log("++++PARAMS++++", JSON.stringify(params));
                    for (var p = 0; p < params.length; p++) {
                        if (child.arguments[0].name == params[p]) {
                            functionConstraints[funcName].constraints.push(
                                new Constraint({
                                    ident: params[p],
                                    value: "'pathContent/file1'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator: child.operator,
                                    expression: expression
                                }),
                                new Constraint({
                                    ident: params[p],
                                    value: "'pathContent/file2'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator: child.operator,
                                    expression: expression
                                }));
                        }
                    }
                }

                if (child.type == "CallExpression" &&
                    child.callee.property &&
                    child.callee.property.name == "readdirSync") {
                    for (var p = 0; p < params.length; p++) {
                        if (child.arguments[0].name == params[p]) {
                            functionConstraints[funcName].constraints.push(
                                new Constraint({
                                    ident: params[0],
                                    value: "'path/filePresent'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator: child.operator,
                                    expression: expression
                                }),
                                new Constraint({
                                    ident: params[0],
                                    value: "'path/fileExists'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator: child.operator,
                                    expression: expression
                                }));
                        }
                    }
                }

                if (child.type == "CallExpression" &&
                    child.callee.property &&
                    child.callee.property.name == "existsSync") {
                    for (var p = 0; p < params.length; p++) {
                        if (child.arguments[0].name == params[p]) {
                            functionConstraints[funcName].constraints.push(
                                new Constraint({
                                    ident: params[0],
                                    // A fake path to a file
                                    value: "'path/fileExists'",
                                    funcName: funcName,
                                    kind: "fileExists",
                                    operator: child.operator,
                                    expression: expression
                                }));
                        }
                    }
                }



            });

            console.log(functionConstraints[funcName]);

        }
    });
}

function traverse(object, visitor) {
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor) {
    var key, child;

    if (visitor.call(null, object)) {
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    traverseWithCancel(child, visitor);
                }
            }
        }
    }
}

function functionName(node) {
    if (node.id) {
        return node.id.name;
    }
    return "";
}


if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function combinations(map) {
    var res = [];
    var current = new Object();
    recurse(map, new ListIterator(Object.keys(map)), current, res);
    return res;
}

function recurse(map, itr, cur, res) {
    if (!itr.hasNext()) {
        var entry = [];
        var keys = Object.keys(cur)
        for (var v in keys) {
            entry.push(cur[keys[v]]);
        }
        res.push(entry);
    } else {
        var v = itr.next();
        var array = map[v];

        for (var index in array) {
            cur[v] = array[index];
            recurse(map, itr, cur, res);
        }

        itr.previous();
    }
}

main();