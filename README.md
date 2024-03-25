[![Continuous Integration](https://github.com/kaiosilveira/split-loop-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/split-loop-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Split loop

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
let averageAge = 0;
let totalSalary = 0;
for (const p of people) {
  averageAge += p.age;
  totalSalary += p.salary;
}
averageAge = averageAge / people.length;
```

</td>

<td>

```javascript
let totalSalary = 0;
for (const p of people) {
  totalSalary += p.salary;
}

let averageAge = 0;
for (const p of people) {
  averageAge += p.age;
}

averageAge = averageAge / people.length;
```

</td>
</tr>
</tbody>
</table>

Loops are one of the most fundamental building blocks in every programming language, they are simple and flexible. But, as we know well, flexibility is a two-edged sword: it's really easy to get carried away and end up with bloated loops holding several responsibilities. This refactoring helps get rid of those cases.

## Working example

Our working example is a simple program that calculates the total salary and finds the youngest age out of a list of people. It looks like this:

```javascript
export function calculateTotalSalaryAndYoungestAge({ people }) {
  let youngest = people[0] ? people[0].age : Infinity;
  let totalSalary = 0;

  for (const p of people) {
    if (p.age < youngest) youngest = p.age;
    totalSalary += p.salary;
  }

  return { youngestAge: youngest, totalSalary };
}
```

As many of the readers will notice, an "and" in the name of a function is often a code smell. It's hinting to us that it's doing more than one thing. That's the issue we'll be working to solve.

### Test suite

The test suite for the function is straightforward:

```javascript
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
```

We're providing it with a list of people and making sure that both `totalSalary` and `youngestAge` are correct for a given list of people.

### Steps

We start our refactoring by duplicating the loop. This step will break the tests because of the duplication, so we need to make sure to get rid of the duplications:

```diff
diff --git a/src/calculate-total-salary-and-youngest-age/index.js b/src/calculate-total-salary-and-youngest-age/index.js
@@ -3,9 +3,12 @@

 export function calculateTotalSalaryAndYoungestAge({ people }) {
   let totalSalary = 0;

   for (const p of people) {
-    if (p.age < youngest) youngest = p.age;
     totalSalary += p.salary;
   }

+  for (const p of people) {
+    if (p.age < youngest) youngest = p.age;
+  }
+
   return { youngestAge: youngest, totalSalary };
 }
```

Formally, that's it for this refactoring. We've split the loop into two, one of each taking care of its own responsibility. But, as it's often the case for these more foundational refactorings, we've just prepared the codebase for deeper changes. Our code now is almost ready for two **[Extract Function](https://github.com/kaiosilveira/split-loop-refactoring)** operations, one on each loop. To prepare for that, we can apply **[Slide Statements](https://github.com/kaiosilveira/slide-statements-refactoring)** into the `youngest` var, so it's closer to its loop:

```diff
diff --git a/src/calculate-total-salary-and-youngest-age/index.js b/src/calculate-total-salary-and-youngest-age/index.js
@@ -1,11 +1,10 @@

 export function calculateTotalSalaryAndYoungestAge({ people }) {
-  let youngest = people[0] ? people[0].age : Infinity;
   let totalSalary = 0;
-
   for (const p of people) {
     totalSalary += p.salary;
   }

+  let youngest = people[0] ? people[0].age : Infinity;
   for (const p of people) {
     if (p.age < youngest) youngest = p.age;
   }
```

Then, we can extract a function containing the loop that calculates the `totalSalary`:

```diff
diff --git a/src/calculate-total-salary-and-youngest-age/index.js b/src/calculate-total-salary-and-youngest-age/index.js
@@ -1,13 +1,16 @@

 export function calculateTotalSalaryAndYoungestAge({ people }) {
-  let totalSalary = 0;
-  for (const p of people) {
-    totalSalary += p.salary;
-  }
-
   let youngest = people[0] ? people[0].age : Infinity;
   for (const p of people) {
     if (p.age < youngest) youngest = p.age;
   }

-  return { youngestAge: youngest, totalSalary };
+  return { youngestAge: youngest, totalSalary: totalSalary(people) };
+}
+
+function totalSalary(people) {
+  let result = 0;
+  for (const p of people) {
+    result += p.salary;
+  }
+  return result;
 }
```

And the same goes for the loop that calculates the `youngestAge`:

```diff
diff --git a/src/calculate-total-salary-and-youngest-age/index.js b/src/calculate-total-salary-and-youngest-age/index.js
@@ -1,10 +1,5 @@

 export function calculateTotalSalaryAndYoungestAge({ people }) {
-  let youngest = people[0] ? people[0].age : Infinity;
-  for (const p of people) {
-    if (p.age < youngest) youngest = p.age;
-  }
-
-  return { youngestAge: youngest, totalSalary: totalSalary(people) };
+  return { youngestAge: youngestAge(people), totalSalary: totalSalary(people) };
 }

 function totalSalary(people) {
@@ -14,3 +9,11 @@ function totalSalary(people) {
   }
   return result;
 }
+
+function youngestAge(people) {
+  let result = people[0] ? people[0].age : Infinity;
+  for (const p of people) {
+    if (p.age < result) result = p.age;
+  }
+  return result;
+}
```

Wrapping up, we can apply some final touches by **[replacing the loop with a pipeline](https://github.com/kaiosilveira/replace-loop-with-pipeline-refactoring)** at `totalSalary(people)`:

```diff

diff --git a/src/calculate-total-salary-and-youngest-age/index.js b/src/calculate-total-salary-and-youngest-age/index.js
@@ -3,11 +3,7 @@

 export function calculateTotalSalaryAndYoungestAge({ people }) {
 }

 function totalSalary(people) {
-  let result = 0;
-  for (const p of people) {
-    result += p.salary;
-  }
-  return result;
+  return people.reduce((acc, p) => acc + p.salary, 0);
 }

 function youngestAge(people) {
```

And **[substituting the algorithm](https://github.com/kaiosilveira/substitute-algorithm-refactoring)** at `youngestAge(people)`:

```diff

diff --git a/src/calculate-total-salary-and-youngest-age/index.js b/src/calculate-total-salary-and-youngest-age/index.js
@@ -7,9 +7,5 @@

 function totalSalary(people) {
 }

 function youngestAge(people) {
-  let result = people[0] ? people[0].age : Infinity;
-  for (const p of people) {
-    if (p.age < result) result = p.age;
-  }
-  return result;
+  return Math.min(...people.map(p => p.age));
 }
```

With that, we're done! We managed to leverage our foundational "split loop" refactoring to allow for more elaborate refactoring compositions.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                        | Message                                             |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [59be648](https://github.com/kaiosilveira/split-loop-refactoring/commit/59be6486a8ee8659188ef922da05e2e6a2b915ca) | duplicate loop and remove duplications              |
| [23f7e59](https://github.com/kaiosilveira/split-loop-refactoring/commit/23f7e5905b03f6bb810cd9cc7d4135135b600cae) | slide `youngest` var closer to its loop             |
| [30d8cad](https://github.com/kaiosilveira/split-loop-refactoring/commit/30d8cad7a4be77d05dae8a9463df3c66ab341bc2) | extract `totalSalary(people)` function              |
| [3c54097](https://github.com/kaiosilveira/split-loop-refactoring/commit/3c54097f7b60dd9e3ba50b3117ae088270675803) | extract `youngestAge(people)` function              |
| [a70b1ee](https://github.com/kaiosilveira/split-loop-refactoring/commit/a70b1eece6ac83b0f7cd2df8fecb8903edb06e72) | replace loop with pipeline at `totalSalary(people)` |
| [c45d4fb](https://github.com/kaiosilveira/split-loop-refactoring/commit/c45d4fb9969fe186d55d9ae92bb38f2d3b700df8) | substitute algorithm at `youngestAge()`             |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/split-loop-refactoring/commits/main).
