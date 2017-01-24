import o from 'ospec';
import condition, {agregate, compare} from '..';

o.spec('conditions', () => {
    o('should validate', () => {
        o(throws(condition.bind(null, {}, {left:'a'}))).equals(true) `Right is required`;
        o(throws(condition.bind(null, {}, {right:'a'}))).equals(true) `left is required`;
    });

    o('test', () => {
        const ctx = {obj:{a:1, b:2, c:3}, arr:[1,'a','b']};
        o(condition({left:'obj.a',right:1},ctx)).equals(true) `path == value`;
        o(condition({left:'obj.a',right:2},ctx)).equals(false) `path != value`;
        o(condition({left:'obj.a',right:'1'},ctx)).equals(true) `path == string`;
        o(condition({left:'obj.a',right:'2'},ctx)).equals(false) `path != string`;
        o(condition({left:1,right:1},ctx)).equals(true) `value == value`;
        o(condition({left:1,right:2},ctx)).equals(false) `value != value`;
        o(condition({left:'obj.a',right:'arr[0]'},ctx)).equals(true) `path == path`;
        o(condition({left:'obj.a',right:'arr[1]'},ctx)).equals(false) `path != path`;
    });

    o('compare values', () => {
        const key = {};

        o(compare('asdf', 'asdf')).equals(true) `equals - true`;
        o(compare('asdf', 'qwer')).equals(false) `equals - true`;
        o(compare({a:1}, {a:1})).equals(true) `equals deep - true`;
        o(compare({a:1}, {a:2})).equals(false) `equals deep - false`;
        o(compare({a:1}, {b:1})).equals(false) `equals deep - false`;

        o(compare(9,3, 'gt')).equals(true) `gt - true`;
        o(compare(3,9, 'gt')).equals(false) `gt - false`;
        o(compare(9,9, 'gt')).equals(false) `gt - false`;
        o(compare(9,3, 'gte')).equals(true) `gte - true`;
        o(compare(3,9, 'gte')).equals(false) `gte - false`;
        o(compare(9,9, 'gte')).equals(true) `gte - true`;

        o(compare(1,3, 'lt')).equals(true) `gt - true`;
        o(compare(3,1, 'lt')).equals(false) `gt - false`;
        o(compare(3,3, 'lt')).equals(false) `gt - false`;
        o(compare(1,3, 'lte')).equals(true) `gte - true`;
        o(compare(3,1, 'lte')).equals(false) `gte - false`;
        o(compare(3,3, 'lte')).equals(true) `gte - true`;

        o(compare(3,[1,2,3], 'in')).equals(true) `in - true`;
        o(compare(3,[1,2,4], 'in')).equals(false) `in - false`;
        o(throws(() => compare(3,3, 'in'))).equals(true) `in - not array`;

        o(compare(key,key, 'exactly')).equals(true) `exactly - true`;
        o(compare({},{}, 'exactly')).equals(false) `exactly - false`;
    });

    o('agregate operators', () => {
        const test = condition => agregate(condition, u => u);
        o(test([1,1,1])).equals(true) `Array and - true`;
        o(test([0,1,1])).equals(false) `Array and - false`;
        o(test({and:[1,1,1]})).equals(true) `and - true`;
        o(test({and:[1,0,1]})).equals(false) `and - false`;
        o(test({or:[0,0,1]})).equals(true) `or - true`;
        o(test({or:[0,0,0]})).equals(false) `or - false`;
        o(test({nand:[1,0,1]})).equals(true) `nand - true`;
        o(test({nand:[1,1,1]})).equals(false) `nand - false`;
        o(test({nor:[0,0,0]})).equals(true) `nor - true`;
        o(test({nor:[0,1,0]})).equals(false) `nor - false`;
    });

    o('agregate recursion', () => {
        o(agregate([
            {or:[1,0]},
            {nor:[1,0]}
        ], u=>u)).equals(false);
    });
});

o.run();

function throws(fn){
    try {fn(); return false;}
    catch(e) {return true;}
}
