# PDF Reference Notes

Source: `/home/ubuntu/upload/ArtificialintelligenceP2.pdf`

## Observed design patterns from reviewed pages

The PDF uses a soft pastel background with a **green-to-blue gradient** and decorative botanical elements in the corners. Several pages also include abstract dots, ring patterns, and blob-like shapes.

A recurring layout pattern places **large text content on one side** and a **featured image on the other side**, often within a circular or rounded frame. Typography is oversized, bold for headings, and uses muted green/olive tones.

The content appears to be organized as a presentation/story-style interface rather than a plain form. Pages emphasize visual balance, centered spacing, and polished card-like composition.

## Image/layout references noticed

- Cover/title slide with large centered heading text.
- Welcome and guideline slides with text on the left and an image on the right.
- Project slide with large image on the left and descriptive text on the right.
- One later page uses a technical illustration style on a light grid background.

## Implications for the web UI

The app should likely present images in a more **intentional, presentation-like layout** rather than as small default previews. The main image area should be prominent, visually framed, and consistent with the PDF's polished composition.

The missing `handleClassify` button and confidence display suggest the current UI may either not be rendering the result panel or may not be wiring prediction state into visible components.

## Additional findings from pages 6-10

Later pages switch to a more **technical blueprint/grid style**. The palette shifts toward dark blue and orange accents on a white graph-paper background.

Most importantly, the PDF includes **iris-focused visuals**:

- A benchmark page showing three iris flowers labeled **Setosa**, **Versicolor**, and **Virginica**.
- A measurement diagram labeling **sepal length**, **sepal width**, **petal length**, and **petal width**.
- Process/logic pages that look like educational slides with large diagrammatic illustrations.

## Design implications for implementation

The results section should likely include a **large, species-relevant iris image or illustration** rather than only text. The measurement inputs can also benefit from a more educational presentation, possibly pairing the form with a specimen image panel.

Because the PDF is focused on iris classification, the app should visually reinforce the three iris classes and the measurement concept, instead of using generic botanical styling alone.
