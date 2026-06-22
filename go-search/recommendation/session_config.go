package recommendation

import (
	ort "github.com/yalue/onnxruntime_go"
)

type Recommender struct {
	Session *ort.DynamicAdvancedSession
}
