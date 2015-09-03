# HW 0 Git Commands and Hooks

## Git Basics

### Introduction Sequence

#### Introduction To Git Commits

```
git commit

git commit
```


#### Git Branching

```
git branch bugFix

git checkout bugFix
```

#### Merging in Git

```
git branch bugFix

git checkout bugFix

git commit

git checkout master

git commit

git merge bugFix
```

#### Rebase Introduction

```
git branch bugFix

git checkout bugFix

git commit

git checkout master

git commit

git checkout bugFix

git rebase master
```

### Ramping Up

#### Detach yo'HEAD

```

git checkout C4
```

#### Relative Refs #1 (^)

```
git checkout bugFix^
```

#### Relative Refs #2 (~)

```

git branch -f master C6

git branch -f bugFix HEAD~2

git checkout HEAD^
```

#### Reversing Changes in Git

```
git reset local~1

git checkout pushed

git revert pushed
```

![alt text](https://github.com/kumar-utsav/HW/blob/master/Images/HW.png "Completed Levels")

### Hooks 

### Content of post-commit file

```
#!/bin/bash

open 'http://www.google.com'
```

![alt text](https://github.com/kumar-utsav/HW/blob/master/Images/HooksTest.gif "Hooks Test GIF")






