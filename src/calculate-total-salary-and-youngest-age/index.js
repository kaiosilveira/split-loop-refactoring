export function calculateTotalSalaryAndYoungestAge({ people }) {
  return { youngestAge: youngestAge(people), totalSalary: totalSalary(people) };
}

function totalSalary(people) {
  return people.reduce((acc, p) => acc + p.salary, 0);
}

function youngestAge(people) {
  return Math.min(...people.map(p => p.age));
}
