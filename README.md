[![npm](https://img.shields.io/npm/v/rpm-stream.svg)](https://www.npmjs.com/package/rpm-stream)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/rpm-stream.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/rpm-stream)
[![Build Status](https://secure.travis-ci.org/arlac77/rpm-stream.png)](http://travis-ci.org/arlac77/rpm-stream)
[![bithound](https://www.bithound.io/github/arlac77/rpm-stream/badges/score.svg)](https://www.bithound.io/github/arlac77/rpm-stream)
[![codecov.io](http://codecov.io/github/arlac77/rpm-stream/coverage.svg?branch=master)](http://codecov.io/github/arlac77/rpm-stream?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/rpm-stream/badge.svg)](https://coveralls.io/r/arlac77/rpm-stream)
[![Code Climate](https://codeclimate.com/github/arlac77/rpm-stream/badges/gpa.svg)](https://codeclimate.com/github/arlac77/rpm-stream)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/rpm-stream/badge.svg)](https://snyk.io/test/github/arlac77/rpm-stream)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/rpm-stream.svg?style=flat-square)](https://github.com/arlac77/rpm-stream/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/rpm-stream.svg?label=ready&title=Ready)](http://waffle.io/arlac77/rpm-stream)
[![Dependency Status](https://david-dm.org/arlac77/rpm-stream.svg)](https://david-dm.org/arlac77/rpm-stream)
[![devDependency Status](https://david-dm.org/arlac77/rpm-stream/dev-status.svg)](https://david-dm.org/arlac77/rpm-stream#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/rpm-stream.svg?branch=master)](http://inch-ci.org/github/arlac77/rpm-stream)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/rpm-stream.svg?style=flat-square)](https://npmjs.org/package/rpm-stream)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

rpm-stream
===

rpm-stream is a streaming rpm packer for node.js/ io.js, basically the rpm
version of tar-stream.

Usage
===
_Don't use this library._

In 99% of all cases, you are better off using the OS supplied rpm toolchain
('rpm', 'rpmbuild', ...).
Creating an rpm package using the built-in toolchain is pretty easy: provide a
text file ('.spec')
containing some metadata for your files, create the package, done.

```sh
$ rpmbuild -bb <specfile>
```

You're probably in the remaining 1% if

* You are not building an rpm once in a while for your beloved open source
project, but are hosting a packaging server.
* You want to be independant of changes in the underlying toolchain, e.g. when
upgrading the OS.
Especially if the whens and whys of such upgrades are controlled by your hosting
platform and not by you.

* You are packaging on a brand new platform, but your rpms need to run in
ancient environments.
* All of your artifacts are already prepared in binary form, maybe in a
repository, and you just need a light rpm wrapper (streaming in memory, avoid
hitting the disk completely)
* You are already using the rpmlib interface for some kung fu voodoo.

== Which version of RPM is supported?

According to <<wikipedia>> there are, well, three versions of rpm:

1. 'THE' rpm
2. rpm.org, a public effort starting around 2007 producing versions 4.8 to 4.10
3. rpm v5 creating version 5

The first rpm i got my hand on was 4.4, so for now the one and only
implementation is 4.4.
Do _not_ expect any newer features such as compression other than gzip (lzma,
xz, ...).

RPM file format specification
===

RPM files are persisted in network byte order and consist of four parts.

Lead
===

Our lead looks like this:

magic (0-3)::
Magic value for both 'file' and rpm utilities ('ED AB EE DB')

major (4)::
RPM Major version ('03')

minor (5)::
RPM minor version ('00')

type (6-9)::
Type binary ('00 00 00 00').
Type source ('00 00 00 01') not supported yet.

deprecated (10-95)::
The rest is not used any more because its format is inflexible.
Content is superseded by the header.
It's only use is to support non-rpm utilities such as 'file' that can identify
rpms based on a magic value.
(85 times '00')

Signature
===

Signature format is equal to header format.
This lib does not support checksums because the order of the checksum field
would require the complete rpm structure to be processed before streaming could
continue.

Header
===

Supported index types:

- NULL = 0
- CHAR = 1
- INT8 = 2
- INT16 = 3
- INT32 = 4
- INT64 = 5
- STRING = 6
- BIN = 7
- STRING_ARRAY = 8

Payload
===

A gzip compressed cpio structure carries the rpm payload. Other compressions
algorithms exist, and are supported by newer versions of 'rpm', but for now it's
gzip.

Bibliography
===

[bibliography]
- [[[wikipedia]]] Wikipedia: [http://en.wikipedia.org/wiki/RPM_Package_Manager]
RPM Package Manager
- [[[maxrpm]]] Edward C. Bailey. Maximum rpm. Red Hat Software, Inc. 1997.
- [[[LSB]]] Linux Base RPM File Format [http://refspecs.linuxbase.org/LSB_3.1.1/LSB-Core-generic/LSB-Core-generic/pkgformat.html]
- [[[cpio]]] FreeBSD cpio (odc and newc) file format spec [http://people.freebsd.org/%7Ekientzle/libarchive/man/cpio.5.txt]
- [[[kernel]]] Al Viro, H. Peter Anvin. initramfs buffer format. Linux Kernel. 2002 [https://www.kernel.org/doc/Documentation/early-userspace/buffer-format.txt]