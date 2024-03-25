import { calculateTotalSalaryAndYoungestAge } from './calculate-total-salary-and-youngest-age';

const result = calculateTotalSalaryAndYoungestAge({
  people: [
    { age: 30, salary: 1000 },
    { age: 25, salary: 1500 },
    { age: 35, salary: 2000 },
  ],
});

console.log(`Youngest age: ${result.youngestAge}, total salary: ${result.totalSalary}`);
