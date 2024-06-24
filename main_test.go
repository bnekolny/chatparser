package main

import (
	"reflect"
	"strings"
	"testing"
)

func TestFilterLinesByAuthor(t *testing.T) {
	// Prepare the test chat content
	chatContent := `
[7/3/22, 06:12:19] Los gringovacos 🇺🇸 🇸🇰: ‎Los mensajes y las llamadas están cifrados de extremo a extremo. Nadie fuera de este chat, ni siquiera WhatsApp, puede leerlos ni escucharlos.
[7/3/22, 06:12:19] Kathleen Mettel: ‎Kathleen Mettel cambió el nombre del grupo a "Los gringos de Colorado".
[7/3/22, 06:12:31] Kathleen Mettel: ‎Se añadió a Kathleen Mettel.
[7/3/22, 06:12:31] Judith Sánchez: ‎Se añadió a Judith Sánchez.
[7/3/22, 06:16:00] Brett: Hola Judith!

Soy Brett. Pienso que quieras ver a esto 💃
‎[7/3/22, 06:16:12] Brett: ‎Video omitido
[7/3/22, 06:18:04] Brett: Si vas a los Estados Unidos, podrías bailar con nuestros en casa y a la rumba
[7/3/22, 06:18:50] Kathleen Mettel: 😂🫣🤣
[7/3/22, 06:19:34] Kathleen Mettel: Uno de nosotros estamos practicando.
[7/3/22, 07:41:50] Kathleen Mettel: *esta
[7/3/22, 11:32:55] Judith Sánchez: ME ENCANTA
[7/3/22, 11:33:17] Judith Sánchez: Siii. ¿Los vecinos se quejarían? 😂
[7/3/22, 11:33:32] Judith Sánchez: Brett, ¿por qué no estás practicando?
`
	// Define the expected result
	expected := map[string][]string{
		"2022-07": {
			"Hola Judith!",
			"Soy Brett. Pienso que quieras ver a esto 💃",
			"‎Video omitido",
			"Si vas a los Estados Unidos, podrías bailar con nuestros en casa y a la rumba",
		},
	}

	textReader := strings.NewReader(chatContent)
	// Call the function
	result, err := filterLinesByAuthor(textReader, "Brett")
	if err != nil {
		t.Fatalf("Error calling filterLinesByAuthor: %v", err)
	}

	// Compare the result with the expected output
	if !reflect.DeepEqual(result, expected) {
		t.Errorf("Expected:\n%v\n, but got:\n%v", expected, result)
	}
}
