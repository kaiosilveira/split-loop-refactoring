export function calculateTotalSalaryAndYoungestAge({ people }) {
  return { youngestAge: youngestAge(people), totalSalary: totalSalary(people) };
}

function totalSalary(people) {
  return people.reduce((acc, p) => acc + p.salary, 0);
}

function youngestAge(people) {
  let result = people[0] ? people[0].age : Infinity;
  for (const p of people) {
    if (p.age < result) result = p.age;
  }
  return result;
}
