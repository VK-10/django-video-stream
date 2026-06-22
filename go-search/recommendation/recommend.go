package recommendation

import (
	"sort"

	ort "github.com/yalue/onnxruntime_go"
	// "github.com/microsoft/onnxruntime-go"
)

type Recommendation struct {
	ItemID int64
	Score  float32
}

func (rc *Recommender) Recommend(userID int64) ([]Recommendation, error) {

	// defer ort.DestroyEnvironment()

	numItems := 31496
	userIDs := make([]int64, numItems)
	itemIDs := make([]int64, numItems)

	for i := 0; i < numItems; i++ {
		userIDs[i] = userID
		itemIDs[i] = int64(i)
	}

	userTensor, err := ort.NewTensor(
		ort.NewShape(int64(numItems)),
		userIDs,
	)
	if err != nil {
		panic(err)
	}
	defer userTensor.Destroy()

	itemTensor, err := ort.NewTensor(
		ort.NewShape(int64(numItems)),
		itemIDs,
	)
	if err != nil {
		panic(err)
	}
	defer itemTensor.Destroy()

	outputTensor, err := ort.NewEmptyTensor[float32](
		ort.NewShape(int64(numItems)),
	)
	if err != nil {
		panic(err)
	}
	defer outputTensor.Destroy()

	// if err != nil {
	// 	panic(err)
	// }
	session := rc.Session
	err = session.Run(
		[]ort.Value{
			userTensor,
			itemTensor,
		},
		[]ort.Value{
			outputTensor,
		},
	)
	if err != nil {
		panic(err)
	}

	scores := outputTensor.GetData()

	recs := make([]Recommendation, numItems)

	for i := 0; i < numItems; i++ {
		recs[i] = Recommendation{
			ItemID: int64(i),
			Score:  scores[i],
		}
	}

	sort.Slice(recs, func(i, j int) bool {
		return recs[i].Score > recs[j].Score
	})

	k := min(10, len(recs))
	topK := recs[:k]
	// topK := recs[:10]

	// for _, rec := range topK {
	// 	fmt.Printf(
	// 		"Item: %d Score: %.4f\n",
	// 		rec.ItemID,
	// 		rec.Score,
	// 	)
	// }

	return topK, nil
}
