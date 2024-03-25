export function calculateTotalSalaryAndYoungestAge({ people }) {
  let youngest = people[0] ? people[0].age : Infinity;
  for (const p of people) {
    if (p.age < youngest) youngest = p.age;
  }

  return { youngestAge: youngest, totalSalary: totalSalary(people) };
}

function totalSalary(people) {
  let result = 0;
  for (const p of people) {
    result += p.salary;
  }
  return result;
}
