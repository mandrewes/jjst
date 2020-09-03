class ModuleRegistry {

    registryMap;

    constructor() {
        this.registryMap = new Map();
    }

    register(name, script) {
        if (!this.registryMap.has(name)) {
            this.registryMap.set(name, script);
        }
    }

    get(name) {
        // return pre-executed function
        return (this.registryMap.get(name))();
    }
}

let mr = new ModuleRegistry();

let ToolsJSFn = function() {
    return {
        doubleIt: function(n) {
            return n * 2;
        }
    }
}

let UserJSFn = function() {

    return {
        User: function(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.visits = 0;

            // return this object itself therefore,
            // when getting from registry get the instance directly
            return this;
        }, 
        fullName: function() {
            return `${this.firstName} ${this.lastName}`;
        },
        doubleVisit: function () {
            return mr.get('./tools.js').doubleIt(this.visits);
        },
        visiting: function() {
            return this.visits += 1;
        }
    };
}

console.log('UserFn: ' + UserJSFn);
console.log('ToolsFn: ' + ToolsJSFn);

console.log('');
console.log('====== Register exported functions ========');
mr.register('./js/user.js', UserJSFn);
mr.register('./tools.js', ToolsJSFn);
mr.register('./js/tools.js', ToolsJSFn);

// emulate the User class
console.log('');
console.log('====== user 1 ========');
// Instead of calling new class, just get the UserFn use .User() to return an instance
let user1 = mr.get('./js/user.js').User('James', 'Bond');

console.log(`user1.firstName: ${user1.firstName}`); // member should be protected by closure!
console.log(`user1.fullName(): ${user1.fullName()}`);
console.log(`user1.visiting(): ${user1.visiting()}`);
console.log(`user1.visiting(): ${user1.visiting()}`);
console.log(`user1.doubleVisit(): ${user1.doubleVisit()}`);

console.log('');
console.log('====== user 2 ========');

/*
    Instead of:
        let user2 = new User('', '');
    Replace with getting from registry and call the constructor simulator.
        let user2 = mr.get('./js/user.js').User('', '');
*/
let user2 = mr.get('./js/user.js').User('Second', 'User');

console.log(`user2.fullName(): ${user2.fullName()}`);
console.log(`user2.visiting(): ${user2.visiting()}`);
console.log(`user2.visiting(): ${user2.visiting()}`);
console.log(`user2.visiting(): ${user2.visiting()}`);
console.log(`user2.visiting(): ${user2.visiting()}`);
console.log(`user2.doubleVisit(): ${user2.doubleVisit()}`);

console.log('');
console.log('====== reaccess ========');

// user1
console.log(`user1.fullName(): ${user1.fullName()}`);
console.log(`user1.doubleVisit(): ${user1.doubleVisit()}`);

// user2
console.log(`user2.fullName(): ${user2.fullName()}`);
console.log(`user2.doubleVisit(): ${user2.doubleVisit()}`);


// If it is not a class export will return function directly
console.log('');
console.log('====== tools.js ========');
console.log(`tools.doubleIt(): ${mr.get('./js/tools.js').doubleIt(2)}`);
