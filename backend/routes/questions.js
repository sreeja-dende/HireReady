const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// Mock questions for demo - organized by role
const mockQuestions = {
  developer: [
    // Software Engineer specific questions (20-30)
    {
      id: '1',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          expectedOutput: '[0,1]'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          expectedOutput: '[1,2]'
        }
      ]
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "()"',
          expectedOutput: 'true'
        },
        {
          input: 's = "()[]{}"',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '3',
      title: 'Merge Two Sorted Lists',
      description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.',
      difficulty: 'Easy',
      topic: 'Linked Lists',
      role: 'developer',
      testCases: [
        {
          input: 'list1 = [1,2,4], list2 = [1,3,4]',
          expectedOutput: '[1,1,2,3,4,4]'
        }
      ]
    },
    {
      id: '4',
      title: 'Maximum Subarray',
      description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
      difficulty: 'Medium',
      topic: 'Dynamic Programming',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
          expectedOutput: '6'
        }
      ]
    },
    {
      id: '5',
      title: 'Climbing Stairs',
      description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      difficulty: 'Easy',
      topic: 'Dynamic Programming',
      role: 'developer',
      testCases: [
        {
          input: 'n = 2',
          expectedOutput: '2'
        },
        {
          input: 'n = 3',
          expectedOutput: '3'
        }
      ]
    },
    {
      id: '6',
      title: 'Binary Tree Inorder Traversal',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
      difficulty: 'Easy',
      topic: 'Trees',
      role: 'developer',
      testCases: [
        {
          input: 'root = [1,null,2,3]',
          expectedOutput: '[1,3,2]'
        }
      ]
    },
    {
      id: '7',
      title: 'Implement Queue using Stacks',
      description: 'Implement a first in first out (FIFO) queue using only two stacks.',
      difficulty: 'Easy',
      topic: 'Stack',
      role: 'developer',
      testCases: [
        {
          input: '["MyQueue","push","push","peek","pop","empty"]',
          expectedOutput: '[null,null,null,1,1,false]'
        }
      ]
    },
    {
      id: '8',
      title: 'Reverse Linked List',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      difficulty: 'Easy',
      topic: 'Linked Lists',
      role: 'developer',
      testCases: [
        {
          input: 'head = [1,2,3,4,5]',
          expectedOutput: '[5,4,3,2,1]'
        }
      ]
    },
    {
      id: '9',
      title: 'Search in Rotated Sorted Array',
      description: 'There is an integer array nums sorted in ascending order (with distinct values). Search for target in nums.',
      difficulty: 'Medium',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [4,5,6,7,0,1,2], target = 0',
          expectedOutput: '4'
        }
      ]
    },
    {
      id: '10',
      title: 'Longest Common Subsequence',
      description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
      difficulty: 'Medium',
      topic: 'Dynamic Programming',
      role: 'developer',
      testCases: [
        {
          input: 'text1 = "abcde", text2 = "ace"',
          expectedOutput: '3'
        }
      ]
    },
    {
      id: '11',
      title: 'Merge Intervals',
      description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
      difficulty: 'Medium',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
          expectedOutput: '[[1,6],[8,10],[15,18]]'
        }
      ]
    },
    {
      id: '12',
      title: 'Lowest Common Ancestor of a Binary Tree',
      description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
      difficulty: 'Medium',
      topic: 'Trees',
      role: 'developer',
      testCases: [
        {
          input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1',
          expectedOutput: '3'
        }
      ]
    },
    {
      id: '13',
      title: 'Course Schedule',
      description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.',
      difficulty: 'Medium',
      topic: 'Graph',
      role: 'developer',
      testCases: [
        {
          input: 'numCourses = 2, prerequisites = [[1,0]]',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '14',
      title: 'Implement Trie (Prefix Tree)',
      description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
      difficulty: 'Medium',
      topic: 'Design',
      role: 'developer',
      testCases: [
        {
          input: '["Trie","insert","search","search","startsWith","insert","search"]',
          expectedOutput: '[null,null,true,false,true,null,true]'
        }
      ]
    },
    {
      id: '15',
      title: 'Median of Two Sorted Arrays',
      description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
      difficulty: 'Hard',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums1 = [1,3], nums2 = [2]',
          expectedOutput: '2.0'
        }
      ]
    },
    {
      id: '16',
      title: 'N-Queens',
      description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard so that no two queens attack each other.',
      difficulty: 'Hard',
      topic: 'Backtracking',
      role: 'developer',
      testCases: [
        {
          input: 'n = 4',
          expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]'
        }
      ]
    },
    {
      id: '17',
      title: 'Serialize and Deserialize Binary Tree',
      description: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer.',
      difficulty: 'Hard',
      topic: 'Trees',
      role: 'developer',
      testCases: [
        {
          input: 'root = [1,2,3,null,null,4,5]',
          expectedOutput: '"1,2,3,#,#,4,5,#,#,#,#"'
        }
      ]
    },
    {
      id: '18',
      title: 'Word Ladder',
      description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter.',
      difficulty: 'Hard',
      topic: 'Graph',
      role: 'developer',
      testCases: [
        {
          input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
          expectedOutput: '5'
        }
      ]
    },
    {
      id: '19',
      title: 'Regular Expression Matching',
      description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\'.',
      difficulty: 'Hard',
      topic: 'Dynamic Programming',
      role: 'developer',
      testCases: [
        {
          input: 's = "aa", p = "a*"',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '20',
      title: 'Maximum Profit in Job Scheduling',
      description: 'We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i].',
      difficulty: 'Hard',
      topic: 'Dynamic Programming',
      role: 'developer',
      testCases: [
        {
          input: 'startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]',
          expectedOutput: '120'
        }
      ]
    },
    // General programming questions (30 more)
    {
      id: '21',
      title: 'Palindrome Number',
      description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'x = 121',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '22',
      title: 'Roman to Integer',
      description: 'Given a roman numeral, convert it to an integer.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 's = "III"',
          expectedOutput: '3'
        }
      ]
    },
    {
      id: '23',
      title: 'Longest Common Prefix',
      description: 'Write a function to find the longest common prefix string amongst an array of strings.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 'strs = ["flower","flow","flight"]',
          expectedOutput: '"fl"'
        }
      ]
    },
    {
      id: '24',
      title: 'Remove Duplicates from Sorted Array',
      description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [1,1,2]',
          expectedOutput: '2'
        }
      ]
    },
    {
      id: '25',
      title: 'Remove Element',
      description: 'Given an integer array nums and an integer val, remove all occurrences of val in nums in-place.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [3,2,2,3], val = 3',
          expectedOutput: '2'
        }
      ]
    },
    {
      id: '26',
      title: 'Implement strStr()',
      description: 'Implement strStr(). Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 'haystack = "hello", needle = "ll"',
          expectedOutput: '2'
        }
      ]
    },
    {
      id: '27',
      title: 'Search Insert Position',
      description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [1,3,5,6], target = 5',
          expectedOutput: '2'
        }
      ]
    },
    {
      id: '28',
      title: 'Length of Last Word',
      description: 'Given a string s consisting of some words separated by some number of spaces, return the length of the last word in the string.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "Hello World"',
          expectedOutput: '5'
        }
      ]
    },
    {
      id: '29',
      title: 'Plus One',
      description: 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'digits = [1,2,3]',
          expectedOutput: '[1,2,4]'
        }
      ]
    },
    {
      id: '30',
      title: 'Add Binary',
      description: 'Given two binary strings a and b, return their sum as a binary string.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'a = "11", b = "1"',
          expectedOutput: '"100"'
        }
      ]
    },
    {
      id: '31',
      title: 'Sqrt(x)',
      description: 'Given a non-negative integer x, compute and return the square root of x.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'x = 4',
          expectedOutput: '2'
        }
      ]
    },
    {
      id: '32',
      title: 'Climbing Stairs (Variation)',
      description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1, 2, or 3 steps.',
      difficulty: 'Easy',
      topic: 'Dynamic Programming',
      role: 'developer',
      testCases: [
        {
          input: 'n = 3',
          expectedOutput: '4'
        }
      ]
    },
    {
      id: '33',
      title: 'Single Number',
      description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
      difficulty: 'Easy',
      topic: 'Bit Manipulation',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [2,2,1]',
          expectedOutput: '1'
        }
      ]
    },
    {
      id: '34',
      title: 'Happy Number',
      description: 'Write an algorithm to determine if a number n is happy.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'n = 19',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '35',
      title: 'Contains Duplicate',
      description: 'Given an integer array nums, return true if any value appears at least twice in the array.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [1,2,3,1]',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '36',
      title: 'Intersection of Two Arrays II',
      description: 'Given two integer arrays nums1 and nums2, return an array of their intersection.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
          expectedOutput: '[2,2]'
        }
      ]
    },
    {
      id: '37',
      title: 'Move Zeroes',
      description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [0,1,0,3,12]',
          expectedOutput: '[1,3,12,0,0]'
        }
      ]
    },
    {
      id: '38',
      title: 'First Unique Character in a String',
      description: 'Given a string s, find the first non-repeating character in it and return its index.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "leetcode"',
          expectedOutput: '0'
        }
      ]
    },
    {
      id: '39',
      title: 'Valid Anagram',
      description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "anagram", t = "nagaram"',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '40',
      title: 'Missing Number',
      description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [3,0,1]',
          expectedOutput: '2'
        }
      ]
    },
    {
      id: '41',
      title: 'Find the Difference',
      description: 'You are given two strings s and t. String t is generated by random shuffling string s and then add one more letter at a random position.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "abcd", t = "abcde"',
          expectedOutput: '"e"'
        }
      ]
    },
    {
      id: '42',
      title: 'Isomorphic Strings',
      description: 'Given two strings s and t, determine if they are isomorphic.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "egg", t = "add"',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '43',
      title: 'Word Pattern',
      description: 'Given a pattern and a string s, find if s follows the same pattern.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 'pattern = "abba", s = "dog cat cat dog"',
          expectedOutput: 'true'
        }
      ]
    },
    {
      id: '44',
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = ["h","e","l","l","o"]',
          expectedOutput: '["o","l","l","e","h"]'
        }
      ]
    },
    {
      id: '45',
      title: 'Reverse Vowels of a String',
      description: 'Given a string s, reverse only all the vowels in the string and return it.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 's = "hello"',
          expectedOutput: '"holle"'
        }
      ]
    },
    {
      id: '46',
      title: 'Intersection of Two Arrays',
      description: 'Given two arrays, write a function to compute their intersection.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
          expectedOutput: '[2]'
        }
      ]
    },
    {
      id: '47',
      title: 'Third Maximum Number',
      description: 'Given integer array nums, return the third maximum number in this array.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [3,2,1]',
          expectedOutput: '1'
        }
      ]
    },
    {
      id: '48',
      title: 'Add Strings',
      description: 'Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string.',
      difficulty: 'Easy',
      topic: 'Math',
      role: 'developer',
      testCases: [
        {
          input: 'num1 = "11", num2 = "123"',
          expectedOutput: '"134"'
        }
      ]
    },
    {
      id: '49',
      title: 'Find All Numbers Disappeared in an Array',
      description: 'Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.',
      difficulty: 'Easy',
      topic: 'Arrays',
      role: 'developer',
      testCases: [
        {
          input: 'nums = [4,3,2,7,8,2,3,1]',
          expectedOutput: '[5,6]'
        }
      ]
    },
    {
      id: '50',
      title: 'Keyboard Row',
      description: 'Given an array of strings words, return the words that can be typed using letters of the alphabet on only one row of American keyboard.',
      difficulty: 'Easy',
      topic: 'Strings',
      role: 'developer',
      testCases: [
        {
          input: 'words = ["Hello","Alaska","Dad","Peace"]',
          expectedOutput: '["Alaska","Dad"]'
        }
      ]
    }
  ],
  'data-analyst': [
    // Data Analyst specific questions (20-30)
    {
      id: '6',
      title: 'Data Analysis: Mean, Median, Mode',
      description: 'Given an array of numbers, calculate the mean, median, and mode.',
      difficulty: 'Easy',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'nums = [1,2,3,4,5]',
          expectedOutput: 'mean: 3, median: 3, mode: null'
        },
        {
          input: 'nums = [1,2,2,3,4]',
          expectedOutput: 'mean: 2.4, median: 2, mode: 2'
        }
      ]
    },
    {
      id: '7',
      title: 'SQL Query: Employee Salaries',
      description: 'Write a SQL query to find employees who earn more than their managers.',
      difficulty: 'Medium',
      topic: 'SQL',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Employee table: id, name, salary, manager_id',
          expectedOutput: 'Query result with employee names'
        }
      ]
    },
    {
      id: '8',
      title: 'Data Cleaning: Remove Duplicates',
      description: 'Given a dataset with duplicate entries, write a function to remove duplicates and return unique records.',
      difficulty: 'Easy',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'data = [1,2,2,3,3,3,4]',
          expectedOutput: '[1,2,3,4]'
        }
      ]
    },
    {
      id: '9',
      title: 'Statistical Analysis: Standard Deviation',
      description: 'Calculate the standard deviation of a given dataset.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'nums = [1,2,3,4,5]',
          expectedOutput: '1.58'
        }
      ]
    },
    {
      id: '10',
      title: 'Data Visualization: Bar Chart',
      description: 'Given sales data, create a function to generate bar chart data.',
      difficulty: 'Easy',
      topic: 'Data Visualization',
      role: 'data-analyst',
      testCases: [
        {
          input: 'sales = {"Jan": 100, "Feb": 150, "Mar": 200}',
          expectedOutput: 'Bar chart data structure'
        }
      ]
    },
    {
      id: '11',
      title: 'Pandas DataFrame Operations',
      description: 'Given a dataset, perform common pandas operations like filtering, grouping, and aggregation.',
      difficulty: 'Medium',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'df = pd.DataFrame({"A": [1,2,3], "B": [4,5,6]})',
          expectedOutput: 'Filtered and aggregated results'
        }
      ]
    },
    {
      id: '12',
      title: 'Excel Formula: VLOOKUP',
      description: 'Write an Excel formula using VLOOKUP to find matching data between two tables.',
      difficulty: 'Easy',
      topic: 'Excel',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Table1: A1:B3, Table2: D1:E3, lookup value in A1',
          expectedOutput: 'VLOOKUP formula result'
        }
      ]
    },
    {
      id: '13',
      title: 'Data Normalization',
      description: 'Normalize a dataset using min-max scaling or z-score normalization.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'data = [1,2,3,4,5], method = "min-max"',
          expectedOutput: '[0.0, 0.25, 0.5, 0.75, 1.0]'
        }
      ]
    },
    {
      id: '14',
      title: 'Correlation Analysis',
      description: 'Calculate the correlation coefficient between two variables.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'x = [1,2,3,4,5], y = [2,4,6,8,10]',
          expectedOutput: '1.0 (perfect positive correlation)'
        }
      ]
    },
    {
      id: '15',
      title: 'Pivot Table Creation',
      description: 'Create a pivot table from raw data to summarize sales by region and product.',
      difficulty: 'Medium',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Raw sales data with columns: Region, Product, Sales',
          expectedOutput: 'Pivot table structure'
        }
      ]
    },
    {
      id: '16',
      title: 'A/B Testing Analysis',
      description: 'Analyze A/B test results to determine statistical significance.',
      difficulty: 'Hard',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Group A: 100 conversions out of 1000, Group B: 120 conversions out of 1000',
          expectedOutput: 'p-value and significance'
        }
      ]
    },
    {
      id: '17',
      title: 'Time Series Forecasting',
      description: 'Implement a simple moving average for time series forecasting.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'data = [10,12,13,12,14,16,15], window = 3',
          expectedOutput: 'Moving average predictions'
        }
      ]
    },
    {
      id: '18',
      title: 'Data Quality Assessment',
      description: 'Write a function to assess data quality by checking for missing values, duplicates, and outliers.',
      difficulty: 'Medium',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'dataset with missing values and outliers',
          expectedOutput: 'Quality assessment report'
        }
      ]
    },
    {
      id: '19',
      title: 'Regression Analysis',
      description: 'Perform simple linear regression and interpret the results.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'x = [1,2,3,4,5], y = [2,4,6,8,10]',
          expectedOutput: 'slope, intercept, and R-squared'
        }
      ]
    },
    {
      id: '20',
      title: 'Dashboard Creation',
      description: 'Design a dashboard layout for key business metrics.',
      difficulty: 'Easy',
      topic: 'Data Visualization',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Metrics: Revenue, Users, Conversion Rate, Churn Rate',
          expectedOutput: 'Dashboard design specification'
        }
      ]
    },
    // General data questions (30 more)
    {
      id: '21',
      title: 'Data Type Conversion',
      description: 'Convert data types in a dataset (string to date, number to string, etc.).',
      difficulty: 'Easy',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'dates = ["2023-01-01", "2023-01-02"], convert to datetime',
          expectedOutput: 'Datetime objects'
        }
      ]
    },
    {
      id: '22',
      title: 'Group By Operations',
      description: 'Perform group by operations on a dataset to calculate aggregates.',
      difficulty: 'Medium',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Sales data grouped by region',
          expectedOutput: 'Aggregated sales by region'
        }
      ]
    },
    {
      id: '23',
      title: 'Data Merging',
      description: 'Merge two datasets based on common columns.',
      difficulty: 'Medium',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Customer data + Order data, merge on customer_id',
          expectedOutput: 'Merged dataset'
        }
      ]
    },
    {
      id: '24',
      title: 'Outlier Detection',
      description: 'Implement outlier detection using statistical methods.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'data = [1,2,3,4,100], method = "IQR"',
          expectedOutput: 'Outlier indices'
        }
      ]
    },
    {
      id: '25',
      title: 'Sampling Techniques',
      description: 'Implement different sampling techniques (random, stratified, etc.).',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'population = [1,2,3,4,5,6,7,8,9,10], sample_size = 3',
          expectedOutput: 'Random sample'
        }
      ]
    },
    {
      id: '26',
      title: 'Categorical Data Encoding',
      description: 'Encode categorical variables using one-hot encoding or label encoding.',
      difficulty: 'Easy',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'categories = ["A", "B", "A", "C"]',
          expectedOutput: 'Encoded values'
        }
      ]
    },
    {
      id: '27',
      title: 'Hypothesis Testing',
      description: 'Perform a t-test to compare means of two groups.',
      difficulty: 'Hard',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'group1 = [1,2,3,4,5], group2 = [2,3,4,5,6]',
          expectedOutput: 't-statistic and p-value'
        }
      ]
    },
    {
      id: '28',
      title: 'Data Imputation',
      description: 'Handle missing values using mean, median, or mode imputation.',
      difficulty: 'Easy',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'data = [1,2,null,4,5], method = "mean"',
          expectedOutput: '[1,2,3,4,5]'
        }
      ]
    },
    {
      id: '29',
      title: 'Feature Scaling',
      description: 'Scale features using standardization or normalization.',
      difficulty: 'Easy',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'features = [1,2,3,4,5], method = "standardization"',
          expectedOutput: 'Scaled features with mean 0 and std 1'
        }
      ]
    },
    {
      id: '30',
      title: 'Cross-tabulation',
      description: 'Create a cross-tabulation table to analyze relationships between categorical variables.',
      difficulty: 'Easy',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Two categorical variables',
          expectedOutput: 'Contingency table'
        }
      ]
    },
    {
      id: '31',
      title: 'Trend Analysis',
      description: 'Analyze trends in time series data.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'time_series = [10,12,15,11,14,16,18]',
          expectedOutput: 'Trend direction and strength'
        }
      ]
    },
    {
      id: '32',
      title: 'Data Export',
      description: 'Export processed data to different formats (CSV, Excel, JSON).',
      difficulty: 'Easy',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'processed_data, format = "CSV"',
          expectedOutput: 'Exported file'
        }
      ]
    },
    {
      id: '33',
      title: 'Performance Metrics',
      description: 'Calculate common performance metrics for classification models.',
      difficulty: 'Medium',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'predictions = [0,1,1,0], actual = [0,1,0,0]',
          expectedOutput: 'accuracy, precision, recall, f1-score'
        }
      ]
    },
    {
      id: '34',
      title: 'Seasonal Decomposition',
      description: 'Decompose a time series into trend, seasonal, and residual components.',
      difficulty: 'Hard',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'monthly_sales_data for 2 years',
          expectedOutput: 'Trend, seasonal, and residual components'
        }
      ]
    },
    {
      id: '35',
      title: 'Customer Segmentation',
      description: 'Segment customers based on their purchasing behavior.',
      difficulty: 'Medium',
      topic: 'Data Processing',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Customer purchase data',
          expectedOutput: 'Customer segments'
        }
      ]
    },
    {
      id: '36',
      title: 'ROI Calculation',
      description: 'Calculate return on investment for marketing campaigns.',
      difficulty: 'Easy',
      topic: 'Business Intelligence',
      role: 'data-analyst',
      testCases: [
        {
          input: 'investment = 1000, revenue = 1500',
          expectedOutput: '50% ROI'
        }
      ]
    },
    {
      id: '37',
      title: 'Churn Prediction',
      description: 'Build a simple churn prediction model using logistic regression.',
      difficulty: 'Hard',
      topic: 'Machine Learning',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Customer data with churn labels',
          expectedOutput: 'Model predictions'
        }
      ]
    },
    {
      id: '38',
      title: 'Market Basket Analysis',
      description: 'Find association rules between products using Apriori algorithm.',
      difficulty: 'Hard',
      topic: 'Data Mining',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Transaction data',
          expectedOutput: 'Association rules'
        }
      ]
    },
    {
      id: '39',
      title: 'Sentiment Analysis',
      description: 'Analyze sentiment of customer reviews.',
      difficulty: 'Medium',
      topic: 'Text Analytics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'reviews = ["Great product!", "Poor quality", "Excellent service"]',
          expectedOutput: 'Sentiment scores'
        }
      ]
    },
    {
      id: '40',
      title: 'Cohort Analysis',
      description: 'Perform cohort analysis to understand customer retention.',
      difficulty: 'Medium',
      topic: 'Business Intelligence',
      role: 'data-analyst',
      testCases: [
        {
          input: 'User signup and activity data',
          expectedOutput: 'Cohort retention table'
        }
      ]
    },
    {
      id: '41',
      title: 'Funnel Analysis',
      description: 'Analyze conversion funnel to identify drop-off points.',
      difficulty: 'Easy',
      topic: 'Business Intelligence',
      role: 'data-analyst',
      testCases: [
        {
          input: 'User journey data through website/app',
          expectedOutput: 'Conversion rates at each step'
        }
      ]
    },
    {
      id: '42',
      title: 'RFM Analysis',
      description: 'Perform RFM (Recency, Frequency, Monetary) analysis for customer segmentation.',
      difficulty: 'Medium',
      topic: 'Business Intelligence',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Customer transaction data',
          expectedOutput: 'RFM scores and segments'
        }
      ]
    },
    {
      id: '43',
      title: 'Anomaly Detection',
      description: 'Detect anomalies in time series data using statistical methods.',
      difficulty: 'Hard',
      topic: 'Statistics',
      role: 'data-analyst',
      testCases: [
        {
          input: 'time_series_data with anomalies',
          expectedOutput: 'Anomaly indices and scores'
        }
      ]
    },
    {
      id: '44',
      title: 'Data Storytelling',
      description: 'Create a compelling data story from analysis results.',
      difficulty: 'Easy',
      topic: 'Data Visualization',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Analysis results and insights',
          expectedOutput: 'Data story narrative'
        }
      ]
    },
    {
      id: '45',
      title: 'ETL Pipeline Design',
      description: 'Design an ETL pipeline for data processing.',
      difficulty: 'Medium',
      topic: 'Data Engineering',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Data sources and requirements',
          expectedOutput: 'ETL pipeline design'
        }
      ]
    },
    {
      id: '46',
      title: 'Data Governance',
      description: 'Implement data governance policies for data quality and security.',
      difficulty: 'Medium',
      topic: 'Data Management',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Data governance requirements',
          expectedOutput: 'Governance framework'
        }
      ]
    },
    {
      id: '47',
      title: 'Real-time Analytics',
      description: 'Set up real-time data processing and analytics.',
      difficulty: 'Hard',
      topic: 'Data Engineering',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Streaming data requirements',
          expectedOutput: 'Real-time analytics setup'
        }
      ]
    },
    {
      id: '48',
      title: 'Data Warehouse Design',
      description: 'Design a data warehouse schema for business intelligence.',
      difficulty: 'Hard',
      topic: 'Data Engineering',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Business requirements and data sources',
          expectedOutput: 'Data warehouse schema'
        }
      ]
    },
    {
      id: '49',
      title: 'Machine Learning Model Evaluation',
      description: 'Evaluate machine learning model performance using various metrics.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Model predictions and actual values',
          expectedOutput: 'Performance metrics'
        }
      ]
    },
    {
      id: '50',
      title: 'Big Data Processing',
      description: 'Process large datasets using distributed computing concepts.',
      difficulty: 'Hard',
      topic: 'Data Engineering',
      role: 'data-analyst',
      testCases: [
        {
          input: 'Large dataset processing requirements',
          expectedOutput: 'Distributed processing solution'
        }
      ]
    }
  ],
  'ai-engineer': [
    // AI Engineer specific questions (20-30)
    {
      id: '11',
      title: 'Linear Regression Implementation',
      description: 'Implement a simple linear regression algorithm from scratch.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'X = [1,2,3,4,5], y = [2,4,6,8,10]',
          expectedOutput: 'slope: 2, intercept: 0'
        }
      ]
    },
    {
      id: '12',
      title: 'Neural Network Forward Pass',
      description: 'Implement the forward pass of a simple neural network.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'input = [1,0.5], weights = [[0.1,0.2],[0.3,0.4]], bias = [0.1,0.2]',
          expectedOutput: 'output after activation'
        }
      ]
    },
    {
      id: '13',
      title: 'K-Means Clustering',
      description: 'Implement the K-means clustering algorithm.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'data = [[1,2],[1.5,1.8],[5,8],[8,8],[1,0.6],[9,11]], k = 2',
          expectedOutput: 'cluster assignments'
        }
      ]
    },
    {
      id: '14',
      title: 'Decision Tree Implementation',
      description: 'Implement a simple decision tree classifier.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'features = [[1,0],[0,1],[1,1],[0,0]], labels = [1,0,1,0]',
          expectedOutput: 'trained decision tree'
        }
      ]
    },
    {
      id: '15',
      title: 'Gradient Descent Optimization',
      description: 'Implement gradient descent for function optimization.',
      difficulty: 'Medium',
      topic: 'Optimization',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'function: f(x) = x^2, start_point = 5, learning_rate = 0.1',
          expectedOutput: 'optimized x value close to 0'
        }
      ]
    },
    {
      id: '16',
      title: 'Convolutional Neural Network',
      description: 'Implement a simple CNN for image classification.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'input_shape = (28,28,1), num_classes = 10',
          expectedOutput: 'CNN model architecture'
        }
      ]
    },
    {
      id: '17',
      title: 'Recurrent Neural Network',
      description: 'Implement an RNN for sequence prediction.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'sequence_length = 10, vocab_size = 100',
          expectedOutput: 'RNN model predictions'
        }
      ]
    },
    {
      id: '18',
      title: 'Natural Language Processing',
      description: 'Implement text preprocessing and tokenization for NLP tasks.',
      difficulty: 'Medium',
      topic: 'NLP',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'text = "Hello, world! This is a test."',
          expectedOutput: 'tokenized and preprocessed text'
        }
      ]
    },
    {
      id: '19',
      title: 'Computer Vision',
      description: 'Implement image preprocessing and feature extraction.',
      difficulty: 'Medium',
      topic: 'Computer Vision',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'image_path = "sample.jpg"',
          expectedOutput: 'extracted features'
        }
      ]
    },
    {
      id: '20',
      title: 'Reinforcement Learning',
      description: 'Implement a simple Q-learning algorithm.',
      difficulty: 'Hard',
      topic: 'Reinforcement Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'environment = GridWorld, episodes = 1000',
          expectedOutput: 'learned Q-table'
        }
      ]
    },
    // General AI/ML questions (30 more)
    {
      id: '21',
      title: 'Model Evaluation Metrics',
      description: 'Calculate precision, recall, F1-score, and confusion matrix.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'predictions = [1,0,1,1,0], actual = [1,0,0,1,0]',
          expectedOutput: 'precision: 0.67, recall: 1.0, f1: 0.8'
        }
      ]
    },
    {
      id: '22',
      title: 'Feature Engineering',
      description: 'Create new features from existing data for better model performance.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'raw_data = {"date": "2023-01-01", "value": 100}',
          expectedOutput: 'engineered features'
        }
      ]
    },
    {
      id: '23',
      title: 'Hyperparameter Tuning',
      description: 'Implement grid search or random search for hyperparameter optimization.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'model = RandomForest, param_grid = {"n_estimators": [10,50,100]}',
          expectedOutput: 'best parameters'
        }
      ]
    },
    {
      id: '24',
      title: 'Dimensionality Reduction',
      description: 'Implement PCA or t-SNE for dimensionality reduction.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'high_dim_data = 100x50 matrix',
          expectedOutput: 'reduced 100x2 matrix'
        }
      ]
    },
    {
      id: '25',
      title: 'Ensemble Methods',
      description: 'Implement bagging or boosting algorithms.',
      difficulty: 'Hard',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'base_models = [DecisionTree, SVM, LogisticRegression]',
          expectedOutput: 'ensemble predictions'
        }
      ]
    },
    {
      id: '26',
      title: 'Transfer Learning',
      description: 'Fine-tune a pre-trained model for a new task.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'pretrained_model = ResNet50, new_dataset = cats_vs_dogs',
          expectedOutput: 'fine-tuned model'
        }
      ]
    },
    {
      id: '27',
      title: 'Autoencoders',
      description: 'Implement an autoencoder for unsupervised learning.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'input_dim = 784, encoding_dim = 32',
          expectedOutput: 'reconstructed data'
        }
      ]
    },
    {
      id: '28',
      title: 'Generative Adversarial Networks',
      description: 'Implement a simple GAN for data generation.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'data_distribution = normal(0,1)',
          expectedOutput: 'generated samples'
        }
      ]
    },
    {
      id: '29',
      title: 'Time Series Analysis',
      description: 'Implement ARIMA or LSTM for time series forecasting.',
      difficulty: 'Hard',
      topic: 'Deep Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'time_series = [1,2,3,4,5,6,7,8,9,10]',
          expectedOutput: 'forecasted values'
        }
      ]
    },
    {
      id: '30',
      title: 'Recommendation Systems',
      description: 'Implement collaborative filtering for recommendation.',
      difficulty: 'Hard',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'user_item_matrix = 100x50 sparse matrix',
          expectedOutput: 'recommendations for user 1'
        }
      ]
    },
    {
      id: '31',
      title: 'Model Interpretability',
      description: 'Implement SHAP or LIME for model interpretation.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'trained_model, test_instance',
          expectedOutput: 'feature importance scores'
        }
      ]
    },
    {
      id: '32',
      title: 'Anomaly Detection',
      description: 'Implement isolation forest or one-class SVM for anomaly detection.',
      difficulty: 'Medium',
      topic: 'Machine Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'normal_data = 1000 samples, test_data = 100 samples',
          expectedOutput: 'anomaly scores'
        }
      ]
    },
    {
      id: '33',
      title: 'Natural Language Understanding',
      description: 'Implement named entity recognition or sentiment analysis.',
      difficulty: 'Hard',
      topic: 'NLP',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'text = "Apple Inc. was founded by Steve Jobs in Cupertino."',
          expectedOutput: 'extracted entities'
        }
      ]
    },
    {
      id: '34',
      title: 'Computer Vision Pipelines',
      description: 'Build an end-to-end computer vision pipeline.',
      difficulty: 'Hard',
      topic: 'Computer Vision',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'images = batch of 32 images',
          expectedOutput: 'classified labels'
        }
      ]
    },
    {
      id: '35',
      title: 'Reinforcement Learning Environments',
      description: 'Create a custom reinforcement learning environment.',
      difficulty: 'Hard',
      topic: 'Reinforcement Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'environment_spec = "grid world with obstacles"',
          expectedOutput: 'RL environment class'
        }
      ]
    },
    {
      id: '36',
      title: 'Model Deployment',
      description: 'Deploy a machine learning model to production.',
      difficulty: 'Medium',
      topic: 'MLOps',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'trained_model, input_data',
          expectedOutput: 'model predictions via API'
        }
      ]
    },
    {
      id: '37',
      title: 'A/B Testing Framework',
      description: 'Design and implement an A/B testing framework.',
      difficulty: 'Medium',
      topic: 'Experimentation',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'experiment_config = {"variants": ["A", "B"], "metrics": ["conversion"]}',
          expectedOutput: 'experiment results'
        }
      ]
    },
    {
      id: '38',
      title: 'Automated Machine Learning',
      description: 'Implement automated feature selection and model selection.',
      difficulty: 'Hard',
      topic: 'AutoML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'dataset, target_variable',
          expectedOutput: 'best model and features'
        }
      ]
    },
    {
      id: '39',
      title: 'Edge AI',
      description: 'Optimize a model for edge device deployment.',
      difficulty: 'Hard',
      topic: 'Edge Computing',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'large_model, target_device = "Raspberry Pi"',
          expectedOutput: 'optimized model'
        }
      ]
    },
    {
      id: '40',
      title: 'Federated Learning',
      description: 'Implement federated learning for privacy-preserving ML.',
      difficulty: 'Hard',
      topic: 'Privacy-Preserving ML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'distributed_datasets = [dataset1, dataset2, dataset3]',
          expectedOutput: 'federated model'
        }
      ]
    },
    {
      id: '41',
      title: 'Graph Neural Networks',
      description: 'Implement a GNN for graph classification or node classification.',
      difficulty: 'Hard',
      topic: 'Graph ML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'graph_data = nodes and edges',
          expectedOutput: 'node embeddings'
        }
      ]
    },
    {
      id: '42',
      title: 'Multi-modal Learning',
      description: 'Combine text and image data for joint learning.',
      difficulty: 'Hard',
      topic: 'Multi-modal AI',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'text_data and image_data',
          expectedOutput: 'joint representations'
        }
      ]
    },
    {
      id: '43',
      title: 'Self-supervised Learning',
      description: 'Implement self-supervised learning techniques.',
      difficulty: 'Hard',
      topic: 'Representation Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'unlabeled_data = 10000 samples',
          expectedOutput: 'learned representations'
        }
      ]
    },
    {
      id: '44',
      title: 'Meta Learning',
      description: 'Implement MAML (Model-Agnostic Meta-Learning).',
      difficulty: 'Hard',
      topic: 'Meta Learning',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'task_distribution',
          expectedOutput: 'meta-learned model'
        }
      ]
    },
    {
      id: '45',
      title: 'AI Ethics and Fairness',
      description: 'Implement fairness metrics and bias detection.',
      difficulty: 'Medium',
      topic: 'AI Ethics',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'model_predictions, sensitive_attributes',
          expectedOutput: 'fairness metrics'
        }
      ]
    },
    {
      id: '46',
      title: 'Neural Architecture Search',
      description: 'Implement a simple neural architecture search algorithm.',
      difficulty: 'Hard',
      topic: 'AutoML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'search_space, dataset',
          expectedOutput: 'optimal architecture'
        }
      ]
    },
    {
      id: '47',
      title: 'Quantum Machine Learning',
      description: 'Implement quantum-enhanced machine learning algorithms.',
      difficulty: 'Hard',
      topic: 'Quantum ML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'classical_data, quantum_circuit',
          expectedOutput: 'quantum-enhanced predictions'
        }
      ]
    },
    {
      id: '48',
      title: 'Causal Inference',
      description: 'Implement causal inference methods for decision making.',
      difficulty: 'Hard',
      topic: 'Causal ML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'observational_data, treatment_variable',
          expectedOutput: 'causal effects'
        }
      ]
    },
    {
      id: '49',
      title: 'Adversarial Robustness',
      description: 'Make a model robust against adversarial attacks.',
      difficulty: 'Hard',
      topic: 'Adversarial ML',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'vulnerable_model, adversarial_examples',
          expectedOutput: 'robust model'
        }
      ]
    },
    {
      id: '50',
      title: 'AI Model Monitoring',
      description: 'Implement monitoring and alerting for deployed AI models.',
      difficulty: 'Medium',
      topic: 'MLOps',
      role: 'ai-engineer',
      testCases: [
        {
          input: 'model_predictions, ground_truth',
          expectedOutput: 'performance alerts'
        }
      ]
    }
  ]
};

// Get questions by role
router.get('/:role', async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role
    const validRoles = ['developer', 'data-analyst', 'ai-engineer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Try to get questions from database first
    try {
      const questions = await Question.find({ role });
      if (questions.length > 0) {
        return res.json(questions);
      }
    } catch (dbError) {
      console.log('Database not available, using mock data');
    }

    // Fallback to mock questions
    const questions = mockQuestions[role] || [];
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new question (for placement cell)
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
