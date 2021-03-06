# The Code(x)

This is the **Shovel apps** CMS code of conduct manifest. Here you'll find guidelines about coding styles, issue reporting and explicit normative about collaboration and bug fixing.

This is by no means a strict requirement, but this manifest will be considered at any time to be rendered against whoever defies it, even when proposing good code or excellent solutions, the way you do it is as important as the proposal itself.

## Docs

Yes. Docs are as important as code. We should care about them even before we start talking about code.

We use github, get used to it. Get to know [MarkDown](https://help.github.com/articles/markdown-basics/) for text formatting, learn it, embrace it, breath it. Every single module, library or snippet is entitled to have its own documentation and usage instructions/guidelines.

If it happens that whatever-code-file you were working on is inside a directory you can use the default `README.md` file and github will display it when entering that directory.

    ├── lib
    │   └── menus
    │       ├── index.js
    │       └── README.md <- menus module docs
    ├── views
    ├── index.js
    └── README.md <- general docs


## Issues

### Title

Name issues according to the problem, not the solution. If you have a solution, propose it in the comments. Try to be concise and precise, something like *application hangs* is not very helpful (although sometimes you will get to that situation).

Try to explain very very very shortly what happens. *app hangs after dir removal* is far more leading than the above example.

### Comment

The issue comment is the place where you can explain yourself and the undesired behaviour. This is the place to request a sub-feature, a functional outcome or a more detailed experience.

The issue itself can't tell you much, we need context. The comment is also the perfect place to indicate how to reproduce the issue so developers can grasp a more technical idea of what's happening. 

We encourage, for those with enough knowledge, to try and propose a solution, but it's not necessary.

## Issue/Feature branching

Branches shall be named accordingly with the issue or problem they are addressing.

  * issue91
  * issue91fix
  * fixLoginView
  * generalFixes

Try to append good commit messages. Not something cryptic, but detailed information of what you did.Try one commit per file or per functional change.

Always merge with *--no-ff*

If you found yourself in front of code and will start fixing, think first if there's an issue about it. If not, create the issue, create the branch, fix it, commit it and merge it.

Also think if it's worth the issue and the branch. It it's a typo, you can risk a main branch commit and push as long as you comment it very **thoroughly**

### Merging

When you are about to merge some issue branch back into *develop*, take into account this checklist:

  * You are merging a branch into the **main development branch** , think before you hit *Enter*
  * Merge comments should include the default branch name message
  * Merging issue branches should include a comment about the issue number or topic to be able to find it later
  * Shall any conflicts arise, you **WILL** resolve them
  * If in doubt (after a conflict resolution) of breaking any code/functionality, comment it on the issue, send mails to everyone and ensure the merge is checked by everyone you can reach. Be aware of the uncomfort you can create and **learn how not to do it again**.


**If you are not confident with your merging/conflict resolution capabilities, make it safe:**

  * When you're done with your branch's commits and push, checkout to *develop*
  * Pull the latest changes in *develop*
  * Checkout your branch again
  * Standing in your branch, merge *develop* **into** your branch:
  * `merge --no-ff develop
  * Resolve conflicts (if any)
  * Checkout *develop*
  * Merge your resolved branch into *develop*
  * Push *develop*

This way will let you keep your conflicts more controlled and not polluting main *develop* branch with scenarios you may or may not be able to resolve.

## Coding

### Variables

**Definition**

Variables should be defined, never use a variable in the global scope. Exceptions will exist, but should be brought to a minimum. And by minimum I really mean a zero (0).

In the unavoidable cases where you should use a global variable, take into consideration these options:

  * Pass the variable into the function through some argument.
  * Define the variable and assign it the value equal to the global one.

Also, we cherish variables defined on top of any codeblock where they will be used or needed.

**Never** define variables inside *if*, *switch*, *for* and *while* codeblocks. 

Do:
```javascript
var thisIsGlobal = true;

function someFunctionality() {
  var one = 1;
  var soGlobal = thisIsGlobal;

  if(one && soGlobal) {
    console.log('Some fine variable definitions');
  }
}

function someOtherFunction(itIsGlobal) {
  var soGlobal = itIsGlobal;

  if(soGlobal) {
    console.log('Nice argument passing');
  }
}
//call it with the global value
someOtherFunction(thisIsGlobal);
```

Do NOT:
```javascript
var thisIsGlobal = true;

function someFunctionality() {
  if(thisIsGlobal) {
    var fuckYouVariable = 'whereverIwantIt';
    console.log('Bad bad bad');
  }
}
```
**Letter casing**

Letter casing usage is more of convention. The usual are:

  * var ClassVariable
  * var classInstanceVariable
  * var SOME_KIND_OF_CONSTANT_VARIABLE
  * var i (some iterator variable)
  * var baseconstructorvariable

Let them guide you, but use it at your own discretion.

**Comma-indent or each its own**

We like variables defined one by one. That is:

```javascript
var one = 1;
var two = 2;
var three;
```
Not:
```javascript
var one = 1, two = 2, three;
```

In the case you really want to define variables in a single liner or comma separated, use this syntax if viable:

```javascript
var one = 1,
  two = 2,
  three;
```

Not:
```javascript
var one = 1
  , two = 2
  , three;
```