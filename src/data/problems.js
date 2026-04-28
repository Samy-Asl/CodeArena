export const problems = [
  // ── EASY ────────────────────────────────────────────────
  {
    id: 'two-sum', title: 'Two Sum', difficulty: 'Easy',
    category: 'Hash Map', tags: ['Array', 'Hash Map'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'],
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
      { input: [[3,3], 6], expected: [0,1] },
      { input: [[-1,-2,-3,-4,-5], -8], expected: [2,4] },
      { input: [[1,2,3,4,5], 9], expected: [3,4] },
    ],
    starterCode: {
      javascript: `// Contraintes : 2 ≤ nums.length ≤ 10^4 | -10^9 ≤ nums[i] ≤ 10^9
// Ne pas modifier la signature
function twoSum(nums, target) {
  // Ton code ici
}`,
      python: `# Contraintes : 2 <= nums.length <= 10^4 | -10^9 <= nums[i] <= 10^9
# Ne pas modifier la signature
def two_sum(nums, target):
    # Ton code ici
    pass`,
    },
    hints: ['Utilise une boucle et cherche le complément.', 'Un Hash Map permet de chercher en O(1).', 'Pour chaque élément x, cherche target - x dans la map.'],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
}`,
    fnName: 'twoSum',
  },
  {
    id: 'reverse-string', title: 'Reverse String', difficulty: 'Easy',
    category: 'Strings', tags: ['String', 'Two Pointers'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters. Do it in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] is a printable ASCII character.'],
    testCases: [
      { input: [['h','e','l','l','o']], expected: ['o','l','l','e','h'] },
      { input: [['H','a','n','n','a','h']], expected: ['h','a','n','n','a','H'] },
      { input: [['a']], expected: ['a'] },
      { input: [['a','b']], expected: ['b','a'] },
    ],
    starterCode: {
      javascript: `// Contraintes : 1 ≤ s.length ≤ 10^5
// Ne pas modifier la signature
function reverseString(s) {
  // Ton code ici
}`,
      python: `# Contraintes : 1 <= s.length <= 10^5
# Ne pas modifier la signature
def reverse_string(s):
    # Ton code ici
    pass`,
    },
    hints: ['Utilise deux pointeurs, un au début et un à la fin.', 'Échange les caractères en avançant les pointeurs vers le centre.', 'while (left < right) { swap; left++; right--; }'],
    solution: `function reverseString(s) {
  let l = 0, r = s.length - 1;
  while (l < r) { [s[l], s[r]] = [s[r], s[l]]; l++; r--; }
  return s;
}`,
    fnName: 'reverseString',
  },
  {
    id: 'palindrome', title: 'Palindrome Check', difficulty: 'Easy',
    category: 'Strings', tags: ['String', 'Two Pointers'],
    description: 'Given a string s, return true if it is a palindrome, or false otherwise. Only alphanumeric characters are considered and case is ignored.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { input: 's = "race a car"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 2×10⁵'],
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [' '], expected: true },
      { input: ['racecar'], expected: true },
      { input: ['hello'], expected: false },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function isPalindrome(s) {
  // Ton code ici
}`,
      python: `# Ne pas modifier la signature
def is_palindrome(s):
    # Ton code ici
    pass`,
    },
    hints: ['Filtre d\'abord les caractères alphanumériques.', 'Compare la chaîne avec son inverse.', 'Utilise deux pointeurs ou s.split("").reverse().join("").'],
    solution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
    fnName: 'isPalindrome',
  },
  {
    id: 'fizzbuzz', title: 'FizzBuzz', difficulty: 'Easy',
    category: 'Math', tags: ['Math', 'String'],
    description: 'Given an integer n, return an array of strings where: "FizzBuzz" for multiples of 3 and 5, "Fizz" for multiples of 3, "Buzz" for multiples of 5, and the number as string otherwise.',
    examples: [
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
      { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    constraints: ['1 ≤ n ≤ 10⁴'],
    testCases: [
      { input: [5], expected: ['1','2','Fizz','4','Buzz'] },
      { input: [3], expected: ['1','2','Fizz'] },
      { input: [1], expected: ['1'] },
      { input: [15], expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'] },
    ],
    starterCode: {
      javascript: `// Contraintes : 1 ≤ n ≤ 10^4
// Ne pas modifier la signature
function fizzBuzz(n) {
  // Ton code ici
}`,
      python: `def fizz_buzz(n):
    # Ton code ici
    pass`,
    },
    hints: ['Utilise l\'opérateur modulo %.', 'Vérifie d\'abord FizzBuzz (divisible par 3 ET 5).', 'Construis un tableau avec une boucle de 1 à n.'],
    solution: `function fizzBuzz(n) {
  return Array.from({length:n},(_,i)=>{const x=i+1;return x%15===0?'FizzBuzz':x%3===0?'Fizz':x%5===0?'Buzz':String(x);});
}`,
    fnName: 'fizzBuzz',
  },
  {
    id: 'max-array', title: 'Max in Array', difficulty: 'Easy',
    category: 'Arrays', tags: ['Array'],
    description: 'Given an array of numbers, return the largest value in the array.',
    examples: [
      { input: 'nums = [4,9,2,11,6]', output: '11' },
      { input: 'nums = [-8,-2,-14]', output: '-2' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    testCases: [
      { input: [[4,9,2,11,6]], expected: 11 },
      { input: [[-8,-2,-14]], expected: -2 },
      { input: [[1]], expected: 1 },
      { input: [[0,0,0]], expected: 0 },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function maxInArray(nums) {
  // Ton code ici
}`,
      python: `def max_in_array(nums):
    pass`,
    },
    hints: ['Utilise Math.max avec le spread operator.', 'Ou parcours le tableau en gardant le max courant.', 'return Math.max(...nums)'],
    solution: `function maxInArray(nums) { return Math.max(...nums); }`,
    fnName: 'maxInArray',
  },
  {
    id: 'count-vowels', title: 'Count Vowels', difficulty: 'Easy',
    category: 'Strings', tags: ['String'],
    description: 'Given a string, return the number of vowels (a, e, i, o, u) in the string (case-insensitive).',
    examples: [
      { input: 's = "Hello World"', output: '3' },
      { input: 's = "aeiou"', output: '5' },
    ],
    constraints: ['0 ≤ s.length ≤ 10⁵'],
    testCases: [
      { input: ['Hello World'], expected: 3 },
      { input: ['aeiou'], expected: 5 },
      { input: [''], expected: 0 },
      { input: ['rhythm'], expected: 0 },
      { input: ['AEIOU'], expected: 5 },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function countVowels(s) {
  // Ton code ici
}`,
      python: `def count_vowels(s):
    pass`,
    },
    hints: ['Parcours chaque caractère.', 'Vérifie si le caractère (en minuscule) est dans "aeiou".', 'Utilise un regex: s.match(/[aeiouAEIOU]/g)?.length ?? 0'],
    solution: `function countVowels(s) { return (s.match(/[aeiouAEIOU]/g) || []).length; }`,
    fnName: 'countVowels',
  },
  {
    id: 'factorial', title: 'Factorial', difficulty: 'Easy',
    category: 'Recursion', tags: ['Math', 'Recursion'],
    description: 'Given a non-negative integer n, return its factorial (n!). Recall that 0! = 1.',
    examples: [
      { input: 'n = 5', output: '120' },
      { input: 'n = 0', output: '1' },
    ],
    constraints: ['0 ≤ n ≤ 12'],
    testCases: [
      { input: [5], expected: 120 },
      { input: [0], expected: 1 },
      { input: [1], expected: 1 },
      { input: [10], expected: 3628800 },
    ],
    starterCode: {
      javascript: `// Contraintes : 0 ≤ n ≤ 12
// Ne pas modifier la signature
function factorial(n) {
  // Ton code ici
}`,
      python: `def factorial(n):
    pass`,
    },
    hints: ['Cas de base: factorial(0) = 1.', 'Cas récursif: n * factorial(n-1).', 'Ou utilise une boucle: résultat = 1; for i in 1..n.'],
    solution: `function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }`,
    fnName: 'factorial',
  },
  // ── MEDIUM ───────────────────────────────────────────────
  {
    id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Medium',
    category: 'Strings', tags: ['String', 'Stack'],
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only.'],
    testCases: [
      { input: ['()'], expected: true },
      { input: ['()[]{}'], expected: true },
      { input: ['(]'], expected: false },
      { input: ['([)]'], expected: false },
      { input: ['{[]}'], expected: true },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function isValid(s) {
  // Ton code ici
}`,
      python: `def is_valid(s):
    pass`,
    },
    hints: ['Utilise une pile (stack).', 'Pour chaque caractère ouvrant, push sur la pile. Pour chaque fermant, pop et compare.', 'La pile doit être vide à la fin pour que la chaîne soit valide.'],
    solution: `function isValid(s) {
  const m = {')':'(',']':'[','}':'{'};
  const st = [];
  for (const c of s) {
    if ('([{'.includes(c)) st.push(c);
    else if (st.pop() !== m[c]) return false;
  }
  return st.length === 0;
}`,
    fnName: 'isValid',
  },
  {
    id: 'merge-sorted', title: 'Merge Two Sorted Arrays', difficulty: 'Medium',
    category: 'Arrays', tags: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Given two sorted arrays nums1 and nums2, merge them into one sorted array.',
    examples: [
      { input: 'nums1 = [1,3,5], nums2 = [2,4,6]', output: '[1,2,3,4,5,6]' },
      { input: 'nums1 = [], nums2 = [1]', output: '[1]' },
    ],
    constraints: ['0 ≤ nums1.length, nums2.length ≤ 200', '-10⁹ ≤ nums1[i], nums2[i] ≤ 10⁹'],
    testCases: [
      { input: [[1,3,5],[2,4,6]], expected: [1,2,3,4,5,6] },
      { input: [[], [1]], expected: [1] },
      { input: [[2], []], expected: [2] },
      { input: [[1,2,3],[4,5,6]], expected: [1,2,3,4,5,6] },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function mergeSorted(nums1, nums2) {
  // Ton code ici
}`,
      python: `def merge_sorted(nums1, nums2):
    pass`,
    },
    hints: ['Utilise deux pointeurs i et j, un par tableau.', 'Compare nums1[i] et nums2[j], pousse le plus petit dans le résultat.', 'N\'oublie pas d\'ajouter les éléments restants.'],
    solution: `function mergeSorted(nums1, nums2) {
  const res = []; let i=0,j=0;
  while(i<nums1.length&&j<nums2.length) nums1[i]<=nums2[j]?res.push(nums1[i++]):res.push(nums2[j++]);
  return res.concat(nums1.slice(i)).concat(nums2.slice(j));
}`,
    fnName: 'mergeSorted',
  },
  {
    id: 'binary-search', title: 'Binary Search', difficulty: 'Medium',
    category: 'Binary Search', tags: ['Array', 'Binary Search'],
    description: 'Given a sorted array of integers and a target, return the index of target or -1 if not found. Must run in O(log n).',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'All values are unique and sorted ascending.'],
    testCases: [
      { input: [[-1,0,3,5,9,12], 9], expected: 4 },
      { input: [[-1,0,3,5,9,12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
      { input: [[1,2,3], 4], expected: -1 },
    ],
    starterCode: {
      javascript: `// O(log n) requis
// Ne pas modifier la signature
function binarySearch(nums, target) {
  // Ton code ici
}`,
      python: `def binary_search(nums, target):
    pass`,
    },
    hints: ['Maintiens deux pointeurs left et right.', 'Calcule mid = (left + right) >> 1.', 'Si nums[mid] < target, déplace left = mid+1, sinon right = mid-1.'],
    solution: `function binarySearch(nums, target) {
  let l=0,r=nums.length-1;
  while(l<=r){const m=(l+r)>>1;if(nums[m]===target)return m;nums[m]<target?l=m+1:r=m-1;}
  return -1;
}`,
    fnName: 'binarySearch',
  },
  {
    id: 'longest-common-prefix', title: 'Longest Common Prefix', difficulty: 'Medium',
    category: 'Strings', tags: ['String'],
    description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.',
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""' },
    ],
    constraints: ['1 ≤ strs.length ≤ 200', '0 ≤ strs[i].length ≤ 200'],
    testCases: [
      { input: [['flower','flow','flight']], expected: 'fl' },
      { input: [['dog','racecar','car']], expected: '' },
      { input: [['a']], expected: 'a' },
      { input: [['ab','a']], expected: 'a' },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function longestCommonPrefix(strs) {
  // Ton code ici
}`,
      python: `def longest_common_prefix(strs):
    pass`,
    },
    hints: ['Commence avec le premier mot comme préfixe.', 'Réduis le préfixe jusqu\'à ce qu\'il soit un début de chaque mot.', 'Utilise startsWith() ou une comparaison caractère par caractère.'],
    solution: `function longestCommonPrefix(strs) {
  let p=strs[0];
  for(const s of strs) while(!s.startsWith(p)) p=p.slice(0,-1);
  return p;
}`,
    fnName: 'longestCommonPrefix',
  },
  {
    id: 'move-zeroes', title: 'Move Zeroes', difficulty: 'Medium',
    category: 'Arrays', tags: ['Array', 'Two Pointers'],
    description: 'Given an integer array nums, move all 0\'s to the end while maintaining the relative order of non-zero elements. Do it in-place.',
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: 'nums = [0]', output: '[0]' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-2³¹ ≤ nums[i] ≤ 2³¹-1'],
    testCases: [
      { input: [[0,1,0,3,12]], expected: [1,3,12,0,0] },
      { input: [[0]], expected: [0] },
      { input: [[1,2,3]], expected: [1,2,3] },
      { input: [[0,0,1]], expected: [1,0,0] },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function moveZeroes(nums) {
  // Ton code ici - modifie nums en place
  return nums;
}`,
      python: `def move_zeroes(nums):
    pass`,
    },
    hints: ['Utilise un pointeur "insertPos" pour la prochaine position non-zéro.', 'Parcours le tableau, pour chaque non-zéro, place-le à insertPos.', 'Puis remplis le reste avec des 0.'],
    solution: `function moveZeroes(nums) {
  let p=0;
  for(const x of nums) if(x!==0) nums[p++]=x;
  while(p<nums.length) nums[p++]=0;
  return nums;
}`,
    fnName: 'moveZeroes',
  },
  {
    id: 'single-number', title: 'Single Number (XOR)', difficulty: 'Medium',
    category: 'Arrays', tags: ['Array', 'Bit Manipulation'],
    description: 'Given a non-empty array where every element appears twice except for one. Find that single one. Must run in O(n) with O(1) extra space.',
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
    ],
    constraints: ['1 ≤ nums.length ≤ 3×10⁴', 'Each element appears twice except for exactly one.'],
    testCases: [
      { input: [[2,2,1]], expected: 1 },
      { input: [[4,1,2,1,2]], expected: 4 },
      { input: [[1]], expected: 1 },
      { input: [[1,1,2,2,3]], expected: 3 },
    ],
    starterCode: {
      javascript: `// XOR trick requis pour O(1) espace
// Ne pas modifier la signature
function singleNumber(nums) {
  // Ton code ici
}`,
      python: `def single_number(nums):
    pass`,
    },
    hints: ['Réfléchis aux propriétés du XOR: a ^ a = 0 et a ^ 0 = a.', 'XOR de tous les éléments → les doublons s\'annulent.', 'return nums.reduce((a,b) => a^b, 0)'],
    solution: `function singleNumber(nums) { return nums.reduce((a,b)=>a^b,0); }`,
    fnName: 'singleNumber',
  },
  {
    id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Medium',
    category: 'Dynamic Programming', tags: ['DP', 'Math'],
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2' },
      { input: 'n = 3', output: '3' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [1], expected: 1 },
      { input: [5], expected: 8 },
      { input: [10], expected: 89 },
    ],
    starterCode: {
      javascript: `// Contraintes : 1 ≤ n ≤ 45
// Ne pas modifier la signature
function climbStairs(n) {
  // Ton code ici
}`,
      python: `def climb_stairs(n):
    pass`,
    },
    hints: ['C\'est la suite de Fibonacci.', 'dp[i] = dp[i-1] + dp[i-2]', 'Initialise avec dp[1]=1, dp[2]=2.'],
    solution: `function climbStairs(n) {
  let a=1,b=2;
  for(let i=3;i<=n;i++){const c=a+b;a=b;b=c;}
  return n===1?1:b;
}`,
    fnName: 'climbStairs',
  },
  {
    id: 'anagram', title: 'Anagram Check', difficulty: 'Medium',
    category: 'Hash Map', tags: ['String', 'Hash Map', 'Sorting'],
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length, t.length ≤ 5×10⁴', 's and t consist of lowercase English letters.'],
    testCases: [
      { input: ['anagram','nagaram'], expected: true },
      { input: ['rat','car'], expected: false },
      { input: ['a','a'], expected: true },
      { input: ['ab','a'], expected: false },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function isAnagram(s, t) {
  // Ton code ici
}`,
      python: `def is_anagram(s, t):
    pass`,
    },
    hints: ['Si les longueurs diffèrent → false.', 'Trie les deux chaînes et compare.', 'Ou utilise un compteur de fréquence.'],
    solution: `function isAnagram(s,t){return s.split('').sort().join('')===t.split('').sort().join('');}`,
    fnName: 'isAnagram',
  },
  // ── HARD ────────────────────────────────────────────────
  {
    id: 'longest-substring', title: 'Longest Substring Without Repeating', difficulty: 'Hard',
    category: 'Sliding Window', tags: ['String', 'Sliding Window', 'Hash Map'],
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    constraints: ['0 ≤ s.length ≤ 5×10⁴', 's consists of English letters, digits, symbols, spaces.'],
    testCases: [
      { input: ['abcabcbb'], expected: 3 },
      { input: ['bbbbb'], expected: 1 },
      { input: ['pwwkew'], expected: 3 },
      { input: [''], expected: 0 },
      { input: ['abcdefg'], expected: 7 },
    ],
    starterCode: {
      javascript: `// Sliding Window O(n)
// Ne pas modifier la signature
function lengthOfLongestSubstring(s) {
  // Ton code ici
}`,
      python: `def length_of_longest_substring(s):
    pass`,
    },
    hints: ['Utilise un Set pour tracker les caractères de la fenêtre.', 'Fenêtre glissante: avance droite, recule gauche si doublon.', 'Met à jour maxLen à chaque étape.'],
    solution: `function lengthOfLongestSubstring(s) {
  const set=new Set(); let l=0,max=0;
  for(let r=0;r<s.length;r++){
    while(set.has(s[r])){set.delete(s[l++]);}
    set.add(s[r]); max=Math.max(max,r-l+1);
  }
  return max;
}`,
    fnName: 'lengthOfLongestSubstring',
  },
  {
    id: 'three-sum', title: 'Three Sum', difficulty: 'Hard',
    category: 'Two Pointers', tags: ['Array', 'Two Pointers', 'Sorting'],
    description: 'Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i≠j≠k≠i and nums[i]+nums[j]+nums[k]=0.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
    ],
    constraints: ['3 ≤ nums.length ≤ 3000', '-10⁵ ≤ nums[i] ≤ 10⁵'],
    testCases: [
      { input: [[-1,0,1,2,-1,-4]], expected: [[-1,-1,2],[-1,0,1]] },
      { input: [[0,1,1]], expected: [] },
      { input: [[0,0,0]], expected: [[0,0,0]] },
      { input: [[-2,0,0,2,2]], expected: [[-2,0,2]] },
    ],
    starterCode: {
      javascript: `// Ne pas modifier la signature
function threeSum(nums) {
  // Ton code ici
}`,
      python: `def three_sum(nums):
    pass`,
    },
    hints: ['Trie d\'abord le tableau.', 'Fixe un élément i, puis utilise deux pointeurs l,r sur le reste.', 'Saute les doublons pour éviter les triplets identiques.'],
    solution: `function threeSum(nums) {
  nums.sort((a,b)=>a-b); const res=[];
  for(let i=0;i<nums.length-2;i++){
    if(i>0&&nums[i]===nums[i-1])continue;
    let l=i+1,r=nums.length-1;
    while(l<r){const s=nums[i]+nums[l]+nums[r];
      if(s===0){res.push([nums[i],nums[l],nums[r]]);while(l<r&&nums[l]===nums[l+1])l++;while(l<r&&nums[r]===nums[r-1])r--;l++;r--;}
      else if(s<0)l++;else r--;}
  }
  return res;
}`,
    fnName: 'threeSum',
  },
  {
    id: 'container-water', title: 'Container With Most Water', difficulty: 'Hard',
    category: 'Two Pointers', tags: ['Array', 'Two Pointers', 'Greedy'],
    description: 'Given an integer array height of length n, find two lines that together form a container that holds the most water. Return the maximum amount of water.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' },
    ],
    constraints: ['2 ≤ height.length ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
    testCases: [
      { input: [[1,8,6,2,5,4,8,3,7]], expected: 49 },
      { input: [[1,1]], expected: 1 },
      { input: [[4,3,2,1,4]], expected: 16 },
      { input: [[1,2,1]], expected: 2 },
    ],
    starterCode: {
      javascript: `// Two Pointers O(n)
// Ne pas modifier la signature
function maxArea(height) {
  // Ton code ici
}`,
      python: `def max_area(height):
    pass`,
    },
    hints: ['Utilise deux pointeurs gauche et droite.', 'L\'eau = min(gauche, droite) × distance.', 'Déplace le pointeur de la ligne la plus courte.'],
    solution: `function maxArea(height) {
  let l=0,r=height.length-1,max=0;
  while(l<r){max=Math.max(max,Math.min(height[l],height[r])*(r-l));height[l]<height[r]?l++:r--;}
  return max;
}`,
    fnName: 'maxArea',
  },
  {
    id: 'rotate-matrix', title: 'Rotate Matrix', difficulty: 'Hard',
    category: 'Arrays', tags: ['Array', 'Math', 'Matrix'],
    description: 'Given an n×n 2D matrix, rotate it 90 degrees clockwise in-place.',
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
    ],
    constraints: ['n == matrix.length == matrix[i].length', '1 ≤ n ≤ 20', '-1000 ≤ matrix[i][j] ≤ 1000'],
    testCases: [
      { input: [[[1,2,3],[4,5,6],[7,8,9]]], expected: [[7,4,1],[8,5,2],[9,6,3]] },
      { input: [[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]], expected: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] },
      { input: [[[1]]], expected: [[1]] },
      { input: [[[1,2],[3,4]]], expected: [[3,1],[4,2]] },
    ],
    starterCode: {
      javascript: `// Rotation in-place
// Ne pas modifier la signature
function rotateMatrix(matrix) {
  // Ton code ici
  return matrix;
}`,
      python: `def rotate_matrix(matrix):
    pass`,
    },
    hints: ['Étape 1: transpose la matrice (échange matrix[i][j] et matrix[j][i]).', 'Étape 2: inverse chaque ligne.', 'Ces deux opérations combinées donnent une rotation 90° clockwise.'],
    solution: `function rotateMatrix(matrix) {
  const n=matrix.length;
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) [matrix[i][j],matrix[j][i]]=[matrix[j][i],matrix[i][j]];
  for(let i=0;i<n;i++) matrix[i].reverse();
  return matrix;
}`,
    fnName: 'rotateMatrix',
  },
  {
    id: 'word-search', title: 'Word Search', difficulty: 'Hard',
    category: 'Recursion', tags: ['Array', 'Backtracking', 'Matrix'],
    description: 'Given an m×n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from sequentially adjacent cells (horizontally or vertically adjacent).',
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' },
    ],
    constraints: ['1 ≤ m, n ≤ 6', '1 ≤ word.length ≤ 15'],
    testCases: [
      { input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'ABCCED'], expected: true },
      { input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'SEE'], expected: true },
      { input: [[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'ABCB'], expected: false },
      { input: [[['a']],'a'], expected: true },
    ],
    starterCode: {
      javascript: `// Backtracking
// Ne pas modifier la signature
function exist(board, word) {
  // Ton code ici
}`,
      python: `def exist(board, word):
    pass`,
    },
    hints: ['DFS depuis chaque cellule qui correspond à word[0].', 'Marque la cellule visitée (ex: avec "#") pour éviter les cycles.', 'Restaure la cellule après le DFS (backtrack).'],
    solution: `function exist(board,word){
  const m=board.length,n=board[0].length;
  function dfs(i,j,k){
    if(k===word.length)return true;
    if(i<0||i>=m||j<0||j>=n||board[i][j]!==word[k])return false;
    const tmp=board[i][j];board[i][j]='#';
    const ok=dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);
    board[i][j]=tmp;return ok;
  }
  for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(dfs(i,j,0))return true;
  return false;
}`,
    fnName: 'exist',
  },
];

export const CATEGORIES = ['Arrays','Strings','Hash Map','Two Pointers','Sliding Window','Recursion','Dynamic Programming','Sorting','Binary Search','Math'];
