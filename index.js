import {get,isFunction,isEqualWith} from 'lodash';

export default function(condition, ctx){
    return agregate(condition, cond => test(ctx, cond));
}

/**
 * Agregate multiple conditions.
 * use `test` to check the condition
 */
export function agregate(condition, test){
    const fn = cond => agregate(cond, test);
    if (Array.isArray(condition)) return condition.every(fn);
    if (condition.and) return condition.and.every(fn);
    if (condition.or) return condition.or.some(fn);
    if (condition.nor) return !condition.nor.some(fn);
    if (condition.nand) return !condition.nand.every(fn);
    return test(condition);
}

/**
 * Test a condition proposition
 */
export function test(ctx, condition){
    const {left, right, operator} = condition;
    if (!('left' in condition && 'right' in condition )) throw new Error('Conditions must define both the left and right of a proposition');
    return compare(
        getValue(left, ctx),
        getValue(right, ctx),
        operator
    );
}

function getValue(path, ctx){
    if (typeof path === 'string' && /\.|\[/.test(path)) return get(ctx, path);
    return path;
}

/**
 * Compare two values
 */
export function compare(left,right,operator){
    if (isFunction(operator)) return operator(left,right);    

    switch (operator){
        case 'greaterThan':
        case 'gt':
            return +left > +right;

        case 'greaterThanOrEqual':
        case 'gte':
            return +left >= +right;

        case 'lesserThan':
        case 'lt':
            return +left < +right;

        case 'lesserThanOrEqual':
        case 'lte':
            return +left <= +right;

        case 'in':
            if (Array.isArray(right)) return right.indexOf(left) !== -1;
            throw new Error('Condition "in" requires right to be a function');

        case 'exactly':
            return left === right;

        case 'equals':
        case undefined:
            return isEqualWith(left, right, equalNumbers);

        default:
            throw new Error('Unknown operator');
    }

    function isNumeric(obj){return typeof obj == 'number' || typeof obj == 'string' && !isNaN(parseFloat(obj));}
    function equalNumbers(left, right){return [left,right].every(isNumeric) ? +left === +right : undefined;}
}
