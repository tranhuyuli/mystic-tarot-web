import os
import json
import glob
import re

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    arcanite_cards_dir = os.path.join(root_dir, "arcanite", "src", "arcanite", "cards", "json", "tarot")
    arcanite_spreads_file = os.path.join(root_dir, "arcanite", "src", "arcanite", "spreads", "tarot-spreads.json")
    cards_png_dir = os.path.join(root_dir, "Cards-png")
    output_dir = os.path.join(root_dir, "src", "data")
    public_cards_dir = os.path.join(root_dir, "public", "cards")

    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(public_cards_dir, exist_ok=True)

    # 1. Load Spreads
    with open(arcanite_spreads_file, "r", encoding="utf-8") as f:
        spreads_raw = json.load(f)

    # 2. Get list of card images
    image_files = os.listdir(cards_png_dir) if os.path.exists(cards_png_dir) else []
    print(f"Found {len(image_files)} image files in Cards-png")

    # Map card_id to image filename
    # E.g., 'the_fool' -> 'major-00-the-fool.png', 'ace_of_cups' -> 'cups-01-ace-of-cups.png'
    def find_image(card_id, suit, number):
        card_slug = card_id.replace("_", "-")
        # Try direct match
        for img in image_files:
            img_lower = img.lower()
            if card_slug in img_lower:
                return f"/cards/{img}"
        # Fallback by suit and number
        suit_prefix = {
            "major_arcana": "major",
            "cups": "cups",
            "pentacles": "pentacles",
            "swords": "swords",
            "wands": "wands"
        }.get(suit, "")
        for img in image_files:
            if img.startswith(f"{suit_prefix}-{number:02d}"):
                return f"/cards/{img}"
        return "/cards/card-back.png"

    # 3. Load 78 cards
    cards = {}
    card_files = sorted(glob.glob(os.path.join(arcanite_cards_dir, "*.json")))
    print(f"Found {len(card_files)} card JSON files in arcanite")

    for card_file in card_files:
        with open(card_file, "r", encoding="utf-8") as f:
            card_data = json.load(f)
            card_id = card_data.get("card_id")
            suit = card_data.get("suit")
            number = card_data.get("card_number", 0)
            img_url = find_image(card_id, suit, number)
            card_data["image"] = img_url
            cards[card_id] = card_data

    # Copy card images to public/cards
    import shutil
    for img in image_files:
        src = os.path.join(cards_png_dir, img)
        dst = os.path.join(public_cards_dir, img)
        shutil.copy2(src, dst)
    print(f"Copied {len(image_files)} images to public/cards")

    # Save consolidated dataset
    combined_data = {
        "spreads": spreads_raw.get("spreads", {}),
        "layouts": spreads_raw.get("layouts", {}),
        "cards": cards
    }

    output_json_path = os.path.join(output_dir, "tarotKnowledgeBase.json")
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully compiled Tarot Knowledge Base ({len(cards)} cards, {len(spreads_raw.get('spreads', {}))} spreads) to {output_json_path}")

if __name__ == "__main__":
    main()
