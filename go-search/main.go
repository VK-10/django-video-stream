package main

import (
	"fmt"
	"sort"

	ort "github.com/yalue/onnxruntime_go"
	// "github.com/microsoft/onnxruntime-go"
)

var modelPath = "./modelsmodel.onnx"
var user_path = ""
var useCoreML = false

type ModelSession struct {
	Session *ort.AdvancedSession
	Input   *ort.Tensor[float32]
	Output  *ort.Tensor[float32]
}

type Recommendation struct {
	ItemID int64
	Score  float32
}

func main() {
	// ort.SetSharedLibraryPath("path/to/onnxruntime.so")

	ort.SetSharedLibraryPath(
		`C:\Users\HP\go\pkg\mod\github.com\yalue\onnxruntime_go@v1.31.0\test_data\onnxruntime.dll`,
	)

	err := ort.InitializeEnvironment()
	if err != nil {
		panic(err)
	}
	defer ort.DestroyEnvironment()

	numItems := 31496
	userIDs := make([]int64, numItems)
	itemIDs := make([]int64, numItems)

	for i := 0; i < numItems; i++ {
		userIDs[i] = 100
		itemIDs[i] = int64(i)
	}

	userTensor, err := ort.NewTensor(
		ort.NewShape(int64(numItems)),
		userIDs,
	)
	if err != nil {
		panic(err)
	}

	itemTensor, err := ort.NewTensor(
		ort.NewShape(int64(numItems)),
		itemIDs,
	)
	if err != nil {
		panic(err)
	}

	outputTensor, err := ort.NewEmptyTensor[float32](
		ort.NewShape(int64(numItems)),
	)
	if err != nil {
		panic(err)
	}

	session, err := ort.NewAdvancedSession("D:/side_projects/video-app/go-search/modelsmodel.onnx",
		[]string{"user_ids", "item_ids"},
		[]string{"scores"},
		[]ort.Value{
			userTensor,
			itemTensor,
		},
		[]ort.Value{
			outputTensor,
		},
		nil,
	)

	if err != nil {
		panic(err)
	}

	if session == nil {
		panic("session is nil")
	}

	err = session.Run()
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

	topK := recs[:10]

	for _, rec := range topK {
		fmt.Printf(
			"Item: %d Score: %.4f\n",
			rec.ItemID,
			rec.Score,
		)
	}
}

// user = np.array([100] * 1000, dtype=np.int64)

// items = np.arange(1000, dtype=np.int64)

// scores = session.run(
//     None,
//     {
//         "user_ids": user,
//         "item_ids": items,
//     }
// )[0]

// top_k = np.argsort(scores)[::-1][:10]

// print(top_k)

// import json

// with open("/kaggle/input/datasets/vishwajeetprasad/processed-dataset-video/item2idx.json", "r") as f:
//     item2idx = json.load(f)

// print(len(item2idx))
// print(list(item2idx.items())[:5])

// idx2item = {v: k for k, v in item2idx.items()}

// recommended_indices = [353 ,280, 191, 555,  95,  48,  71, 496 ,847 , 38]

// recommended_items = [
//     idx2item[idx]
//     for idx in recommended_indices
// ]

// print(recommended_items)

// import pandas as pd

// metadata_df = pd.read_parquet(
//     "/kaggle/working/raw/amazon_metadata_1M.parquet"
// )

// print(metadata_df.shape)
// print(metadata_df.columns)
// metadata_df.head()

// recommended_ids = [
//     '6304698801',
//     '0792844874',
//     '0783239416',
//     'B00000BLFI',
//     '0783114907',
//     '0767825489',
//     '0780618548',
//     '6305744823',
//     'B00004WG2F',
//     '0767821556'
// ]

// metadata_df[
//     metadata_df["parent_asin"].isin(recommended_ids)

// ]
