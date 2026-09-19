export const referenceProblemDsl = `problem total-from-parts {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity base: amount = 30
    quantity count: item = 4
    quantity unitValue: amountPerItem = ?
    quantity total: amount = 210

    equation {
        total = base + count * unitValue
    }

}
`;
