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
git checkout bugFix

git checkout C4
```

#### Relative Refs #1 (^)

```
git checkout bugFix^
```

#### Relative Refs #2 (~)

```
git checkout HEAD^

git branch -f master C6

git branch -f bugFix C0
```

#### Reversing Changes in Git

```
git reset local~1

git checkout pushed

git revert pushed
```





