# Contributing to Matrix Chat Angular

Thank you for your interest in contributing to Matrix Chat Angular! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Good bug reports include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Provide a clear use case
- Explain why this would be useful to most users
- Consider implementation complexity

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YourUsername/matrixChat-angular.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run build
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Describe what your PR does
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

```bash
# Clone the repository
git clone https://github.com/BakkeshSatvik/matrixChat-angular.git
cd matrixChat-angular

# Install dependencies
npm install

# Start development server
npm start
```

## Coding Standards

### TypeScript
- Use TypeScript strict mode
- Provide type annotations for function parameters
- Avoid `any` type when possible
- Use interfaces for object shapes

### Angular
- Use standalone components
- Follow Angular style guide
- Use signals for local state
- Use RxJS for async operations
- Implement OnDestroy for cleanup

### CSS/Tailwind
- Use Tailwind utility classes
- Keep custom CSS minimal
- Follow responsive design principles
- Ensure accessibility

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add message reactions support
fix: resolve login error on Firefox
docs: update README with new features
```

## Project Structure

```
src/app/
├── components/     # UI components
├── services/       # Business logic
├── models/         # TypeScript interfaces
├── guards/         # Route guards
└── utils/          # Utility functions
```

## Testing

- Write unit tests for new services
- Add component tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

## Documentation

- Update README for user-facing changes
- Update IMPLEMENTATION.md for architecture changes
- Add JSDoc comments for complex functions
- Include code examples where helpful

## Questions?

Feel free to:
- Open an issue for questions
- Ask in pull request comments
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make Matrix Chat Angular better for everyone! 🎉
