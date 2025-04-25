# Licensing Recommendations

## Current License Status

The SchedulEd repository currently does not have a formal license file. Before making the repository public, it is essential to add an appropriate license to clearly define how others can use, modify, and distribute the codebase.

## Recommended License

For a web application like SchedulEd, we recommend one of the following licenses:

### MIT License

The MIT License is a permissive license that allows others to use, modify, distribute, and even commercialize your code with minimal restrictions. It only requires that the original copyright notice and license text be included in any copies or substantial portions of the software.

**Benefits:**
- Simple and easy to understand
- Highly permissive
- Compatible with other open-source licenses
- Widely used in the JavaScript/Node.js ecosystem

### Apache License 2.0

The Apache License is slightly more detailed than MIT and provides explicit patent rights grants, making it more suitable for organizations concerned about patent litigation.

**Benefits:**
- Includes patent protection
- Requires stating changes
- More detailed terms about trademark usage
- Good for enterprise adoption

## Implementation Steps

1. Create a `LICENSE` file in the root directory of the repository
2. Add the chosen license text
3. Update the `package.json` file to include the license information
4. Add license information to the README.md

## Example MIT License Text

```
MIT License

Copyright (c) 2024 SchedulEd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Dependencies Compliance

When choosing a license, it's important to ensure compliance with the licenses of all dependencies. The project currently uses several dependencies with various licenses:

- Most NPM packages use MIT, ISC, or BSD licenses
- React and Next.js use MIT licenses
- Some visualization libraries may have their own licenses

A full license compliance audit is recommended before finalizing the license choice.

## License in package.json

After selecting a license, update the `package.json` file to include:

```json
{
  "name": "scheduledapp",
  "version": "0.1.0",
  "license": "MIT",
  ...
}
```

## Final Recommendations

1. Consult with legal counsel before choosing a license
2. Add the LICENSE file before making the repository public
3. Ensure all team members understand the implications of the chosen license
4. Keep track of all third-party code and their licenses
5. Consider adding a NOTICE file if using components with attribution requirements 