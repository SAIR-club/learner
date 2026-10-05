#!/usr/bin/env node
import 'dotenv/config'
import { optionValue } from './cli.js'
import { startLearnServer } from './server.js'
import type { SeedTopic } from './seed.js'
import { BLANK_TOPIC, loadTopicFile } from './topic-file.js'
import { resolveGraphFilePath, resolvePort, resolveTopicFilePath } from './config.js'

/**
 * Starts the Learn surface and prints where it is.
 *
 * The printed line is the whole interface: it says where to look and what is behind it. Nothing is opened
 * automatically, because a program that opens a browser is a program that acts without being asked.
 */
const argv = process.argv.slice(2)
const defaultPath = resolveGraphFilePath()

if (argv.includes('--help') || argv.includes('-h')) {
  process.stdout.write(
    `EPISTEME · Learn —— 本地网页界面\n` +
      `\n  用法：pnpm learn:web [选项]\n` +
      `\n  选项：\n` +
      `    -f, --file <路径>    指定图谱文件（默认 ${defaultPath}）\n` +
      `    -p, --port <端口>    监听端口（默认 4321）\n` +
      `    -t, --topic <路径>   从你自己的主题文件开始，而不是内置的示例主题\n` +
      `        --blank          从空图谱开始，什么都不载入\n` +
      `    -h, --help           显示这份说明\n` +
      `\n  环境变量：EPISTEME_FILE 与 --file 等效，PORT 与 --port 等效；命令行参数优先。\n` +
      `\n  主题文件是一个 JSON：{ "title": ?, "nodes": [{ "label": ?, "kind": ? }] }，\n` +
      `  kind 可以是 concept（默认）/ question / claim。\n` +
      `\n  只监听本机回环地址。这里没有身份验证，所以不要把它暴露到网络上。\n\n`,
  )
  process.exit(0)
}

const fileOption = optionValue(argv, '--file', '-f')
const filePath = resolveGraphFilePath(fileOption)
const portOption = optionValue(argv, '--port', '-p')
const port = resolvePort(portOption)
const topicOption = optionValue(argv, '--topic', '-t')
const topicPath = resolveTopicFilePath(topicOption)
const blank = argv.includes('--blank')

if (topicPath !== undefined && blank) {
  process.stderr.write('--topic 和 --blank 不能同时使用：一个要载入材料，一个要什么都不载入。\n')
  process.exit(1)
}

let topic: SeedTopic | undefined
try {
  topic = blank ? BLANK_TOPIC : topicPath === undefined ? undefined : await loadTopicFile(topicPath)
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`)
  process.exit(1)
}

const server = await startLearnServer({
  port,
  filePath,
  ...(topic === undefined ? {} : { topic }),
})

process.stdout.write(
  `\nEPISTEME · Learn\n` +
    `\n  界面：  ${server.url}\n` +
    `  图谱：  ${filePath}\n` +
    `\n  这是你自己认知图谱上的一个本地界面。你记录的一切都会写入磁盘，关掉进程也不会丢。\n` +
    `  只监听本机回环地址：这里没有身份验证，所以没有什么是可以暴露到网络上的。\n\n` +
    `  按 Ctrl+C 停止。\n\n`,
)
