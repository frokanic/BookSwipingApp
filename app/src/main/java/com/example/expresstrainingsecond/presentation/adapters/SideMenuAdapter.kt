package com.example.expresstrainingsecond.presentation.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.example.expresstrainingsecond.databinding.ItemSideMenuContentsBinding
import com.example.expresstrainingsecond.domain.models.SideMenuItem


class SideMenuAdapter(
    val sideMenuItems: List<SideMenuItem>
): RecyclerView.Adapter<SideMenuAdapter.SideMenuViewHolder>() {

    private var onItemClickListener: ((SideMenuItem) -> Unit)? = null
    var index = 1


    inner class SideMenuViewHolder(val binding: ItemSideMenuContentsBinding):
        RecyclerView.ViewHolder(binding.root)


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SideMenuViewHolder {
        return SideMenuViewHolder(ItemSideMenuContentsBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
            )
        )
    }


    override fun onBindViewHolder(holder: SideMenuViewHolder, position: Int) {
        val binding = holder.binding
        val currentItem = sideMenuItems[position]

        holder.itemView.apply {

            if (currentItem.activityId.isNullOrEmpty()) {
                binding.tvItem.text = "$index - ${currentItem.moduleName}" + "\n_____________________________"
                index += 1
            } else {
                binding.tvItem.text = "     ${currentItem.activityName}"
            }

            setOnClickListener {
                onItemClickListener?.let { it(currentItem) }
            }
        }
    }

    override fun getItemCount(): Int {
        return sideMenuItems.size
    }


    fun setOnItemClickListener(listener: (SideMenuItem) -> Unit) {
        onItemClickListener = listener
    }


}
