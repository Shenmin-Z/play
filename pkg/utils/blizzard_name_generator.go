//https://www.reddit.com/r/Overwatch/comments/6pezvd/why_the_pants

package utils

import (
	"math/rand"
)

var firstEN = []string{"Ghost", "Hidden", "Golden", "Shadow", "Eternal", "Fancy", "Lazy", "Nice", "Cocky", "Epic"}
var lastEN = []string{"Pants", "Tiger", "Goose", "Rabbit", "Hedgehog", "Dragon", "Storm", "Potato"}

var firstZH = []string{"鬼之", "隐藏之", "黄金之", "暗影之", "永恒之", "好看之", "懒惰的", "不错的", "神气的", "创世纪之"}
var lastZH = []string{"裤", "虎", "鹅", "兔", "刺猬", "龙", "风暴", "土豆"}

var firstJP = []string{"鬼の", "隠れた", "黄金の", "影の", "永遠の", "派手な", "怠惰な", "美しい", "誇りの", "神を感動させる"}
var lastJP = []string{"ズボン", "虎", "ガチョウ", "兎", "ハリネズミ", "ドラゴン", "吹雪", "じゃがいも"}

var fs = [][]string{firstEN, firstZH, firstJP}
var ls = [][]string{lastEN, lastZH, lastJP}

var lang = []string{"en", "zh", "jp"}

func GenerateName() string {

	langIdx := rand.Intn(len(lang))
	first := fs[langIdx]
	last := ls[langIdx]
	firstIdx := rand.Intn(len(first))
	lastIdx := rand.Intn(len(last))

	return first[firstIdx] + last[lastIdx]
}
