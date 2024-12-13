const ACTIONS = {
  JOIN: 'join',
  JOINED: 'joined',
  DISCONNECTED: 'disconnected',
  CODE_CHANGE: 'code-change',
  LANGUAGE_CHANGE: 'language-change',
  SYNC_CODE: 'sync-code',
  LEAVE: 'leave',
  START_EXECUTION: 'start-execution',
  INPUT: 'input',
  OUTPUT: 'output',
  ERROR: 'error',
  CLEAR_TERMINAL: 'clear-terminal',
  EXECUTION_COMPLETE: 'execution-complete'
}

export const languageDetails = {
    JavaScript: {
      name: 'JavaScript',
      defaultCode: 'console.log("Hello, world!");',
      extension: '.js'
    },
    Cpp: {
      name: 'C++',
      defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, world!";\n  return 0;\n}',
      extension: '.cpp'
    },
    Python: {
      name: 'Python',
      defaultCode: 'print("Hello, world!")',
      extension: '.py'
    },
    Java: {
      name: 'Java',
      defaultCode: 'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}',
      extension: '.java'
    },
    C: {
      name: 'C',
      defaultCode: '#include <stdio.h>\n\nint main() {\n  printf("Hello, world!\\n");\n  return 0;\n}',
      extension: '.c'
    },
    Go: {
      name: 'Go',
      defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, world!")\n}',
      extension: '.go'
    },
    Rust: {
      name: 'Rust',
      defaultCode: 'fn main() {\n    println!("Hello, world!");\n}',
      extension: '.rs'
    },
    PHP: {
      name: 'PHP',
      defaultCode: '<?php\n\necho "Hello, world!";\n?>',
      extension: '.php'
    }
};
  

export default ACTIONS;