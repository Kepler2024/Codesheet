import unittest

from tools.langs import adapter


class AdapterTests(unittest.TestCase):
    def test_wrapped_statements_keep_original_line_numbers(self):
        cases = [
            ('java', 'import java.util.List;\n// hello\nSystem.out.println(List.of(1));\n', 'static void main'),
            ('cpp', '#include <iostream>\nusing namespace std;\ncout << 1;\n', 'int main'),
            ('go', 'import (\n "fmt"\n)\nfmt.Println(1)\n', 'func main'),
            ('kotlin', 'import java.util.PriorityQueue\nprintln(PriorityQueue<Int>().size)\n', 'fun main'),
            ('rust', 'use std::{\n collections::HashMap,\n};\nprintln!("{}", HashMap::<i32,i32>::new().len());\n', 'fn main'),
        ]
        for lang, code, entry in cases:
            with self.subTest(lang=lang):
                result = adapter(lang).prepare(code, 20)
                self.assertIn(entry, result.source)
                generated = result.source.splitlines()
                for offset, line in enumerate(code.splitlines(), 20):
                    indices = [i for i, item in enumerate(generated) if item.strip() == line.strip()]
                    self.assertTrue(any(result.line_map[i] == offset for i in indices), (lang, line))
                self.assertLess(generated.index(code.splitlines()[0]), next(i for i, line in enumerate(generated) if entry in line))

    def test_own_entry_keeps_top_level_declarations(self):
        cases = {
            'java': 'class Helper {}\nclass App { static void main(String[] args) {} }\n',
            'cpp': 'struct Helper {};\nint f() { return 1; }\nint main() {}\n',
            'go': 'package main\ntype Helper struct{}\nfunc f() int { return 1 }\nfunc main() {}\n',
            'rust': 'struct Helper;\nfn f() {}\nfn main() {}\n',
            'kotlin': 'class Helper\nfun f() = 1\nfun main() {}\n',
        }
        for lang, code in cases.items():
            with self.subTest(lang=lang):
                result = adapter(lang).prepare(code, 7)
                self.assertEqual(result.source.strip(), code.strip())
                self.assertEqual(result.line_map, list(range(7, 7 + len(code.splitlines()))))

    def test_java_selects_entry_class_after_helper_and_public_filename(self):
        code = 'public class Helper {}\nclass App { public static void main(String[] args) {} }\n'
        result = adapter('java').prepare(code, 2)
        self.assertEqual(result.filename, 'Helper.java')
        self.assertEqual(result.run[-1], 'App')

    def test_java_package_qualified_entry(self):
        code = 'package sample;\nclass Helper {}\npublic class App { public static void main(String[] args) {} }\n'
        result = adapter('java').prepare(code, 2)
        self.assertEqual(result.run[-1], 'sample.App')
        self.assertIn('-d', result.compile[0])

    def test_go_package_without_main_still_hoists_imports(self):
        code = 'package main\n\nimport "fmt"\nfmt.Println(1)\n'
        result = adapter('go').prepare(code, 10)
        self.assertEqual(result.source.count('package main'), 1)
        self.assertLess(result.source.index('import "fmt"'), result.source.index('func main'))
        self.assertEqual(result.line_map[result.source.splitlines().index('fmt.Println(1)')], 13)

    def test_import_terminators_in_comments_do_not_end_hoisting(self):
        cases = [
            ('go', 'import (\n// ) is a comment\n"fmt"\n)\nfmt.Println(1)\n', 'func main', ')'),
            ('rust', 'use std::{\n// ; is a comment\ncollections::HashMap,\n};\nprintln!("{}", HashMap::<i32,i32>::new().len());\n', 'fn main', '};'),
        ]
        for lang, code, entry, terminator in cases:
            with self.subTest(lang=lang):
                result = adapter(lang).prepare(code, 2)
                lines = result.source.splitlines()
                self.assertLess(lines.index(terminator), next(i for i, line in enumerate(lines) if entry in line))

    def test_additional_valid_entry_signatures(self):
        cases = {'java': 'class App { public static synchronized void main(String[] args) {} }\n',
                 'cpp': 'auto main() -> int { return 0; }\n'}
        for lang, code in cases.items():
            with self.subTest(lang=lang):
                result = adapter(lang).prepare(code, 2)
                self.assertEqual(result.source, code)

    def test_never_wrap_languages(self):
        for lang, code in [('python', 'print(1)\n'), ('javascript', 'console.log(1);\n'), ('typescript', 'console.log(1);\n'), ('csharp', 'Console.WriteLine(1);\n'), ('swift', 'print(1)\n')]:
            with self.subTest(lang=lang):
                result = adapter(lang).prepare(code, 5)
                self.assertEqual(result.source, code)
                self.assertEqual(result.line_map, [5])

    def test_main_in_comment_does_not_disable_wrapping(self):
        cases = {'java': '// static void main(\nSystem.out.println(1);\n',
                 'cpp': '// int main(\nint x = 1;\n', 'go': '// func main(\nx := 1; _ = x\n',
                 'rust': '// fn main(\nprintln!("1");\n', 'kotlin': '// fun main(\nprintln(1)\n'}
        for lang, code in cases.items():
            with self.subTest(lang=lang):
                result = adapter(lang).prepare(code, 1)
                self.assertGreater(len(result.source.splitlines()), len(code.splitlines()))


if __name__ == '__main__':
    unittest.main()
