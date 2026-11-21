import unittest

from tools.core import HEADINGS, compare_output, expected_comments, lint, parse


class ParsingTests(unittest.TestCase):
    def test_fences_stdin_and_markdown_positions(self):
        doc = parse('# Title\n\n```python nocheck\nprint(input())\n```\n\n```text stdin\n3\n4 5 6\n```\n', 'python')
        self.assertEqual(len(doc.blocks), 2)
        block = doc.runs[0]
        self.assertEqual((block.line, block.code_line, block.code), (3, 4, 'print(input())\n'))
        self.assertEqual(block.stdin, '3\n4 5 6\n')
        self.assertEqual(block.flags, ('nocheck',))

    def test_prose_breaks_stdin_attachment(self):
        doc = parse('```python\npass\n```\nexample:\n```text stdin\nx\n```\n', 'python')
        self.assertEqual(doc.runs[0].stdin, '')
        self.assertTrue(any(i.line == 5 and 'directly follows' in i.message for i in lint(doc)))

    def test_one_input_cannot_attach_twice_or_to_display_block(self):
        doc = parse('```bash\necho hi\n```\n```text stdin\nx\n```\n', 'python')
        self.assertTrue(any('directly follows' in i.message for i in lint(doc)))

    def test_unclosed_fence_is_structural_error(self):
        doc = parse('```python\nprint(1)\n', 'python')
        self.assertEqual(doc.errors[0].line, 1)
        self.assertIn('unclosed', doc.errors[0].message)

    def test_headings_inside_code_are_not_sections(self):
        doc = parse('```python\n## Variables\n```\n', 'python')
        self.assertEqual(doc.headings, [])

    def test_output_comment_extraction_and_whitespace(self):
        doc = parse('```python\nprint(1) #=> 1\n# => two   three\n```\n', 'python')
        self.assertEqual([(c.line, c.tokens) for c in expected_comments(doc.runs[0], 'python')], [(2, ['1']), (3, ['two', 'three'])])
        self.assertEqual(expected_comments(parse('```java\n// ordinary\n// => a b\n```\n', 'java').runs[0], 'java')[0].line, 3)


class ComparisonTests(unittest.TestCase):
    def comments(self, code):
        return expected_comments(parse('```python\n' + code + '\n```\n', 'python').runs[0], 'python')

    def test_token_comparison_ignores_line_breaks(self):
        self.assertIsNone(compare_output(self.comments('# => 0 1 2'), '0\n1\t2\n', 1))

    def test_first_differing_comment_is_reported(self):
        issue = compare_output(self.comments('# => one\n# => two three'), 'one two WRONG', 1)
        self.assertEqual(issue.line, 3)
        self.assertIn("expected 'two three'", issue.message)
        self.assertIn("actual 'two WRONG'", issue.message)

    def test_missing_partial_comment(self):
        issue = compare_output(self.comments('# => one\n# => two three'), 'one two', 1)
        self.assertEqual(issue.line, 3)
        self.assertIn('missing output', issue.message)

    def test_wrong_token_precedes_missing_tokens(self):
        issue = compare_output(self.comments('# => one two'), 'WRONG', 1)
        self.assertIn('output mismatch', issue.message)

    def test_extra_output_with_and_without_comments(self):
        for comments, stdout in [(self.comments('# => one'), 'one extra'), ([], 'extra')]:
            issue = compare_output(comments, stdout, 7)
            self.assertEqual(issue.line, 7)
            self.assertIn('extra output not covered', issue.message)

    def test_empty_expected_comment(self):
        self.assertIsNone(compare_output(self.comments('# =>'), '\n ', 1))
        self.assertIsNone(compare_output([], '', 1))


class LintTests(unittest.TestCase):
    def valid(self, extra=''):
        return '# Python Cheat Sheet\n\n> Written for Python 3.14\n\n' + '\n'.join('## ' + h for h in HEADINGS) + '\n' + extra

    def test_valid_skeleton_and_extra_heading(self):
        self.assertEqual(lint(parse(self.valid().replace('## Arrays', '## Extra\n## Arrays'), 'python')), [])

    def test_header_and_version(self):
        issues = lint(parse('# Wrong\nprose\n> Written for X\n', 'python'))
        self.assertTrue(any(i.line == 1 and 'Cheat Sheet' in i.message for i in issues))
        self.assertTrue(any('Written for' in i.message for i in issues))

    def test_missing_reordered_and_duplicate_heading(self):
        for text in [self.valid().replace('## Math\n', ''), self.valid().replace('## Math', '## Variables'), self.valid() + '\n## Variables\n']:
            self.assertTrue(lint(parse(text, 'python')))

    def test_allowed_tags_flags_norun_and_warning(self):
        for fence in ['```\nx\n```', '```ruby\nx\n```', '```python wrong\nx\n```', '```bash nocheck\nx\n```', '```python norun\nx\n```', '```python norun nocheck\n# why\n```']:
            self.assertTrue(any(not i.warning for i in lint(parse(self.valid(fence), 'python'))), fence)
        doc = parse(self.valid('```python norun\n# cannot run this\ninvalid\n```\n```python\nprint(1) # => 1 CAREFUL\n```'), 'python')
        issues = lint(doc)
        self.assertEqual(len(issues), 1)
        self.assertTrue(issues[0].warning)


if __name__ == '__main__':
    unittest.main()
