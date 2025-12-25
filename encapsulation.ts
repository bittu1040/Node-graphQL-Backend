// npx tsx encapsulation.ts


class Person {
    private name: string;
    protected age: number;
    public email: string;

    constructor(name: string, age: number, email: string) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    public getAge(): number {
        return this.age;
    }
    public getName(): string {
        return this.name;
    }
}

const p1= new Person("Alice", 30, "alice@example.com");

class employee extends Person {
    private employeeId: number;

    constructor(name: string, age: number, email: string, employeeId: number) {
        super(name,age,email);
        this.employeeId = employeeId;
    }

    getEmployeeDetails(): string {
        return `Employee ID: ${this.employeeId}, Age: ${this.age}, Email: ${this.email}, Name: ${this.getName()}`;
    }
}

