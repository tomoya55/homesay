module.exports = {
    moduleFileExtensions: ["ts", "tsx", "js"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json",
            diagnostics: true,
        },
    },
    testMatch: ["<rootDir>/test/**/?(*.)+(spec|test).[jt]s?(x)"],
};
