import { calculateTotalSalaryAndYoungestAge } from './index';

describe('calculateTotalSalaryAndYoungestAge', () => {
  it('should calculate the total salary and the youngest age for a given group of people', () => {
    const result = calculateTotalSalaryAndYoungestAge({
      people: [
        { age: 30, salary: 1000 },
        { age: 25, salary: 1500 },
        { age: 35, salary: 2000 },
      ],
    });

    expect(result).toEqual({ youngestAge: 25, totalSalary: 4500 });
  });
});
