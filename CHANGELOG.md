# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2023-05-06

### Changed

- **BREAKING CHANGE** : APIのURLを `POST /` から `POST /api` に変更
- VercelなどのRead-only file systemでも動くように、leveldownをrocksdbに置き換え (`npm run format` でのデータベースの再構築が必要)
- e-Stat 統計LODのSPARQLエンドポイントが、limit指定に関わらず最大でも10000件しか返さなくなっていたので、クライアント側でpaginationするようにした
- macOSでもセットアップできるように修正

### Added

- 番地と号の間の「の」への対応 (例：1丁目2の3)
- Vercelデプロイに対応
