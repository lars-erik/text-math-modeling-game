export const referenceProblemDsl = `problem drone-power {
    concepts {
        arithmetic.addition
        arithmetic.multiplication
        algebra.variable
        linear.one-unknown
    }

    quantity basePower: power = 30
    quantity droneCount: item = 4
    quantity dronePower: powerPerItem = ?
    quantity totalPower: power = 210

    equation {
        totalPower = basePower + droneCount * dronePower
    }

    scenario gaming.drone-power
    symbol dronePower = p
}
`;
