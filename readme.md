# Minno - conditions

This repo holds the conditions DSL for [minnojs](minnojs.github.io).
It holds the function that manages calculating conditions for the POJO DSL used throughout Minno.

## Signature

`result = conditions(condition, ctx);`

Argument     | Type                                 | Required | Description
------------ | ------------------------------------ | -------- | ---
`condition`  | `Condition|Agregator`                | Yes      | A condition or agregator to be evaluated
`ctx`        | `Object`                             | No       | The context object from which to pull paths
**returns**  | `Boolean`                            |          | Whether this condition is true or not

## Conditions
Conditions are POJO that describe a proposition. 
You can think of them as equations.
Each MUST have both a `left` and a `right` property that corespond to the left and right sides of the equation.

```javascript
// 'value' === 'value'
conditions({left:'value', right:'value'}); // true
```

Any string that has either **.** or **[** is considered to be a path to be taken out of the `ctx` using [lodash get](https://lodash.com/docs/4.17.4#get).

```javascript
// ctx.obj.score === 12 
conditions({left:'obj.score', right:12}, {obj:{score:12}}); // true

// ctx.arr[1] === 12
conditions({left:'arr[1]', right:12}, {arr:[1,2]}); // false
```

You can choose the method for comparison using the `operator` parameter:

```javascript
// 333 > 100
conditions({left:333, right:100, operator: 'gt'}); // true
```

Following are the possible values for `operator`

Value               | Description
-----------         | -----------
equals              | The default value for `operator`. Deep equals, treats numbers and string type numbers as equal.
exactly             | ===
gt                  | >
greaterThan         | >
gte                 | >=
greaterThanEquals   | >=
lt                  | <
lesserThan          | <
lte                 | <=
lesserThanEquals    | <=
in                  | left in right, when right is an array

You can also use a custom operator by setting it to a function:

```javascript
// start with the same letter
conditions({left:'hello', right:'hi', operator: (left,right) => left[0] === right[0]}, ctx); // true
```

## Agregators
You can agregate several conditions by wrapping them in Agregator objects.
Agregators have the form of an object with a single property.
One exception to this rule is the simple array which is always treated as an `and` agregator.

The following condition will only be true if `cond1` and `cond2` are both true:

```javascript
var cond = {and:[cond1, cond2]};
```

Following is a list of supported aggregators.

Aggregator  | Description
----------- | --------------
and         | If all conditions are true
or          | If at least one condition is true
nor         | If all conditions are false
nand        | If at least one condition is false

Following are several examples for how to create aggregations:

```javascript
// Condition1 && Condition2
compare({and:[Condition1,Condition2]});

// Condition1 && Condition2 && Condition3
compare([Condition1,Condition2,Condition3]);

// Condition1 || Condition2
compare({or:[Condition1,Condition2]});
```
